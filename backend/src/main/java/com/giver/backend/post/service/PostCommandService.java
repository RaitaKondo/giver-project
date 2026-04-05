package com.giver.backend.post.service;

import com.giver.backend.context.dto.PostContextResponse;
import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.context.entity.ContextMaster;
import com.giver.backend.context.repository.ContextMasterRepository;
import com.giver.backend.post.entity.Post;
import com.giver.backend.post.entity.PostContext;
import com.giver.backend.post.entity.PostImage;
import com.giver.backend.post.dto.request.CreatePostRequest;
import com.giver.backend.post.dto.response.PostImageResponse;
import com.giver.backend.post.dto.response.PostResponse;
import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.storage.GcsImageStorageService;
import com.giver.backend.storage.GcsSignedUrlService;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PostCommandService {

  private static final int MAX_IMAGES = 4;
  private static final long MAX_FILE_SIZE_BYTES = 5L * 1024L * 1024L;
  private static final String PUBLIC_VISIBILITY = "PUBLIC";
  private static final Set<String> ALLOWED_VISIBILITIES = Set.of("PUBLIC", "FOLLOWERS", "PRIVATE");

  private final PostRepository postRepository;
  private final ContextMasterRepository contextMasterRepository;
  private final GcsImageStorageService gcsImageStorageService;
  private final GcsSignedUrlService gcsSignedUrlService;
  private final CurrentUserService currentUserService;
  private final UserAccountRepository userAccountRepository;

  public PostCommandService(
      PostRepository postRepository,
      ContextMasterRepository contextMasterRepository,
      GcsImageStorageService gcsImageStorageService,
      GcsSignedUrlService gcsSignedUrlService,
      CurrentUserService currentUserService,
      UserAccountRepository userAccountRepository
  ) {
    this.postRepository = postRepository;
    this.contextMasterRepository = contextMasterRepository;
    this.gcsImageStorageService = gcsImageStorageService;
    this.gcsSignedUrlService = gcsSignedUrlService;
    this.currentUserService = currentUserService;
    this.userAccountRepository = userAccountRepository;
  }

  @Transactional
  public PostResponse create(CreatePostRequest request, List<MultipartFile> images) {
    final List<MultipartFile> safeImages = normalizeImages(images);

    // バリデーション意図:
    // - 要件の枚数制限と MIME type の簡易検査をここで一元的に実施し、保存処理を安全にする。
    validateImages(safeImages);

    // Firebase 認証後に users テーブルへ同期された現在ユーザーを投稿者として採用する。
    final UUID authorId = currentUserService.requireCurrentUserId();

    final Post post = new Post(
        authorId,
        request.title(),
        request.actionText(),
        request.conflictText(),
        request.changeText(),
        normalizeVisibility(request.visibility())
    );

    // 処理順序の意図:
    // 1) 先に Post を保存して postId を確定。
    // 2) その postId を使って GCS オブジェクト名を安定生成。
    Post savedPost = postRepository.save(post);

    attachImages(savedPost, safeImages);
    attachContexts(savedPost, request.contextIds());

    // 画像を addImage で関連付けた後に再保存し、post_images を cascade で永続化する。
    savedPost = postRepository.save(savedPost);

    return toResponse(savedPost);
  }

  private List<MultipartFile> normalizeImages(List<MultipartFile> images) {
    // multipart 画像は省略可能なので null を空配列として扱い、呼び出し側の分岐を減らす。
    return images == null ? List.of() : images;
  }

  private String normalizeVisibility(String visibility) {
    // visibility 正規化の意図:
    // - 省略時の既定値を PUBLIC に固定しつつ、入力の大文字小文字の揺れを吸収する。
    if (visibility == null || visibility.isBlank()) {
      return PUBLIC_VISIBILITY;
    }
    final String normalized = visibility.trim().toUpperCase(Locale.ROOT);
    if (!ALLOWED_VISIBILITIES.contains(normalized)) {
      throw new IllegalArgumentException(
          "visibility must be one of: " + Arrays.toString(ALLOWED_VISIBILITIES.toArray())
      );
    }
    return normalized;
  }

  private void validateImages(List<MultipartFile> images) {
    if (images.size() > MAX_IMAGES) {
      throw new IllegalArgumentException("Up to 4 images are allowed.");
    }

    for (MultipartFile image : images) {
      if (image == null || image.isEmpty()) {
        throw new IllegalArgumentException("Image file must not be empty.");
      }
      if (image.getSize() > MAX_FILE_SIZE_BYTES) {
        throw new IllegalArgumentException("Each image must be <= 5MB.");
      }

      // multipart の contentType から image/* かを簡易判定して、非画像アップロードを拒否する。
      final String contentType = image.getContentType();
      if (contentType == null || !contentType.startsWith("image/")) {
        throw new IllegalArgumentException("Only image/* content type is allowed.");
      }
    }
  }

  private void attachImages(Post post, List<MultipartFile> images) {
    for (int i = 0; i < images.size(); i++) {
      final MultipartFile image = images.get(i);

      // GCS 保存の意図:
      // - URL ではなく objectName をDBに保持し、配信時に都度署名URLを生成する設計にする。
      final GcsImageStorageService.StoredObject stored = gcsImageStorageService.storePostImage(post.getId(), image);

      final PostImage postImage = new PostImage(stored.objectName(), i);
      post.addImage(postImage);
    }
  }

  private void attachContexts(Post post, List<Long> contextIds) {
    final LinkedHashSet<Long> normalizedIds = normalizeContextIds(contextIds);
    if (normalizedIds.isEmpty()) {
      return;
    }

    final List<ContextMaster> contextMasters = contextMasterRepository.findByIdInAndIsActiveTrue(normalizedIds);
    if (contextMasters.size() != normalizedIds.size()) {
      throw new IllegalArgumentException("contextIds contains invalid or inactive context master id.");
    }

    final Map<Long, ContextMaster> contextMasterMap = contextMasters.stream()
        .collect(Collectors.toMap(ContextMaster::getId, Function.identity()));

    for (Long contextId : normalizedIds) {
      post.addContext(contextMasterMap.get(contextId));
    }
  }

  private LinkedHashSet<Long> normalizeContextIds(List<Long> contextIds) {
    if (contextIds == null || contextIds.isEmpty()) {
      return new LinkedHashSet<>();
    }
    return new LinkedHashSet<>(contextIds);
  }

  private PostResponse toResponse(Post post) {
    final UserAccount author = userAccountRepository.findById(post.getAuthorId())
        .orElseThrow(() -> new IllegalArgumentException("Author not found: " + post.getAuthorId()));
    final List<PostImageResponse> imageResponses = post.getImages().stream()
        .sorted(Comparator.comparingInt(PostImage::getSortOrder))
        .map(this::toImageResponse)
        .toList();
    final List<PostContextResponse> contextResponses = post.getPostContexts().stream()
        .sorted(Comparator.comparing((PostContext postContext) -> postContext.getContextMaster().getSortOrder())
            .thenComparing(postContext -> postContext.getContextMaster().getId()))
        .map(postContext -> new PostContextResponse(
            postContext.getContextMaster().getId(),
            postContext.getContextMaster().getCode(),
            postContext.getContextMaster().getName(),
            postContext.getContextMaster().getCategory()
        ))
        .toList();

    return new PostResponse(
        post.getId(),
        post.getAuthorId(),
        author.getDisplayName(),
        author.getPhotoUrl(),
        post.getTitle(),
        post.getActionText(),
        post.getConflictText(),
        post.getChangeText(),
        post.getVisibility(),
        post.getCreatedAt(),
        imageResponses,
        contextResponses
    );
  }

  private PostImageResponse toImageResponse(PostImage image) {
    // 署名付きURL生成の意図:
    // - オブジェクトを直接公開せず、短命URLをレスポンス生成時に都度発行して返す。
    final String signedUrl = gcsSignedUrlService.createGetSignedUrl(image.getObjectName());
    return new PostImageResponse(image.getId(), signedUrl, image.getSortOrder());
  }
}
