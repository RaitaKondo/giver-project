package com.giver.backend.post.service;

import com.giver.backend.context.dto.PostContextResponse;
import com.giver.backend.post.entity.Post;
import com.giver.backend.post.entity.PostContext;
import com.giver.backend.post.entity.PostImage;
import com.giver.backend.post.dto.request.SearchPostsRequest;
import com.giver.backend.post.dto.response.PostImageResponse;
import com.giver.backend.post.dto.response.PostResponse;
import com.giver.backend.post.dto.response.PostSummaryResponse;
import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.storage.GcsSignedUrlService;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PostQueryService {

  private static final int PREVIEW_MAX_LENGTH = 120;
  private static final Set<String> ALLOWED_VISIBILITIES = Set.of("PUBLIC", "FOLLOWERS", "PRIVATE");

  private final PostRepository postRepository;
  private final GcsSignedUrlService gcsSignedUrlService;

  public PostQueryService(
      PostRepository postRepository,
      GcsSignedUrlService gcsSignedUrlService
  ) {
    this.postRepository = postRepository;
    this.gcsSignedUrlService = gcsSignedUrlService;
  }

  public PostResponse findById(UUID postId) {
    // 詳細取得の処理フロー:
    // 1) images を含めて投稿を取得
    // 2) 見つからない場合は 404 用の例外に変換
    // 3) object_name から署名付きURLを都度生成してレスポンスへ変換
    final Post post = postRepository.findWithImagesById(postId)
        .orElseThrow(() -> new NoSuchElementException("Post not found: " + postId));
    return toPostResponse(post);
  }

  public Page<PostSummaryResponse> search(SearchPostsRequest request) {
    // 一覧取得の並び順の意図:
    // - createdAt の降順を固定し、新しい投稿が先に表示される仕様を担保する。
    final Pageable pageable = PageRequest.of(
        request.normalizedPage(),
        request.normalizedSize(),
        Sort.by(Sort.Direction.DESC, "createdAt")
    );

    final String visibility = normalizeVisibilityFilter(request.visibility());
    final Page<Post> posts = visibility == null
        ? postRepository.findAll(pageable)
        : postRepository.findByVisibility(visibility, pageable);

    return posts.map(this::toSummaryResponse);
  }

  private String normalizeVisibilityFilter(String visibility) {
    if (visibility == null || visibility.isBlank()) {
      return null;
    }
    final String normalized = visibility.trim().toUpperCase(Locale.ROOT);
    if (!ALLOWED_VISIBILITIES.contains(normalized)) {
      throw new IllegalArgumentException("Invalid visibility filter.");
    }
    return normalized;
  }

  private PostResponse toPostResponse(Post post) {
    final List<PostImageResponse> images = post.getImages().stream()
        .sorted(Comparator.comparingInt(PostImage::getSortOrder))
        .map(this::toImageResponse)
        .toList();
    final List<PostContextResponse> contexts = toContextResponses(post);

    return new PostResponse(
        post.getId(),
        post.getAuthorId(),
        post.getTitle(),
        post.getActionText(),
        post.getConflictText(),
        post.getChangeText(),
        post.getVisibility(),
        post.getCreatedAt(),
        images,
        contexts
    );
  }

  private PostSummaryResponse toSummaryResponse(Post post) {
    final String thumbnailUrl = post.getImages().stream()
        .min(Comparator.comparingInt(PostImage::getSortOrder))
        .map(PostImage::getObjectName)
        // 署名付きURL生成の意図:
        // - DB には object_name のみ保存し、返却時だけ短命URLを作って公開範囲を限定する。
        .map(gcsSignedUrlService::createGetSignedUrl)
        .orElse(null);

    return new PostSummaryResponse(
        post.getId(),
        post.getAuthorId(),
        post.getTitle(),
        toActionTextPreview(post.getActionText()),
        post.getVisibility(),
        post.getCreatedAt(),
        thumbnailUrl,
        toContextResponses(post)
    );
  }

  private PostImageResponse toImageResponse(PostImage image) {
    final String signedUrl = gcsSignedUrlService.createGetSignedUrl(image.getObjectName());
    return new PostImageResponse(image.getId(), signedUrl, image.getSortOrder());
  }

  private String toActionTextPreview(String actionText) {
    if (actionText == null) {
      return null;
    }
    if (actionText.length() <= PREVIEW_MAX_LENGTH) {
      return actionText;
    }
    return actionText.substring(0, PREVIEW_MAX_LENGTH);
  }

  private List<PostContextResponse> toContextResponses(Post post) {
    return post.getPostContexts().stream()
        .sorted(Comparator.comparing((PostContext postContext) -> postContext.getContextMaster().getSortOrder())
            .thenComparing(postContext -> postContext.getContextMaster().getId()))
        .map(postContext -> new PostContextResponse(
            postContext.getContextMaster().getId(),
            postContext.getContextMaster().getCode(),
            postContext.getContextMaster().getName(),
            postContext.getContextMaster().getCategory()
        ))
        .toList();
  }
}
