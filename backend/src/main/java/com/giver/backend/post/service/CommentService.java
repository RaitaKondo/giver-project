package com.giver.backend.post.service;

import com.giver.backend.auth.AppAuthenticatedUser;
import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.post.dto.request.CreateCommentRequest;
import com.giver.backend.post.dto.request.UpdateCommentRequest;
import com.giver.backend.post.dto.response.CommentResponse;
import com.giver.backend.post.entity.Comment;
import com.giver.backend.post.entity.Post;
import com.giver.backend.post.repository.CommentRepository;
import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.UserAccountRepository;
import com.giver.backend.user.service.UserPhotoUrlResolver;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CommentService {

  private static final Set<String> COMMENTABLE_VISIBILITIES = Set.of("PUBLIC");
  private static final Pattern URL_PATTERN = Pattern.compile("(?i)\\b(?:https?://|www\\.)\\S+");

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserAccountRepository userAccountRepository;
  private final UserPhotoUrlResolver userPhotoUrlResolver;
  private final CurrentUserService currentUserService;

  public CommentService(
      CommentRepository commentRepository,
      PostRepository postRepository,
      UserAccountRepository userAccountRepository,
      UserPhotoUrlResolver userPhotoUrlResolver,
      CurrentUserService currentUserService
  ) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.userAccountRepository = userAccountRepository;
    this.userPhotoUrlResolver = userPhotoUrlResolver;
    this.currentUserService = currentUserService;
  }

  @Transactional(readOnly = true)
  public List<CommentResponse> list(UUID postId) {
    requirePublicPost(postId);
    return commentRepository.findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(postId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public CommentResponse create(UUID postId, CreateCommentRequest request) {
    requirePublicPost(postId);
    final UUID userId = currentUserService.requireCurrentUserId();
    final String body = normalizeBody(request.body());
    final Comment saved = commentRepository.save(new Comment(postId, userId, body));
    return toResponse(saved);
  }

  @Transactional
  public CommentResponse update(UUID commentId, UpdateCommentRequest request) {
    final UUID userId = currentUserService.requireCurrentUserId();
    final Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
        .orElseThrow(() -> new NoSuchElementException("Comment not found: " + commentId));
    requirePublicPost(comment.getPostId());
    if (!comment.getUserId().equals(userId)) {
      throw new IllegalArgumentException("Only comment author can edit this comment.");
    }

    comment.updateBody(normalizeBody(request.body()));
    return toResponse(comment);
  }

  @Transactional
  public void delete(UUID commentId) {
    final AppAuthenticatedUser currentUser = currentUserService.requireCurrentUser();
    final Comment comment = commentRepository.findByIdAndDeletedAtIsNull(commentId)
        .orElseThrow(() -> new NoSuchElementException("Comment not found: " + commentId));
    final Post post = requirePublicPost(comment.getPostId());

    final boolean isCommentAuthor = comment.getUserId().equals(currentUser.userId());
    final boolean isPostAuthor = post.getAuthorId().equals(currentUser.userId());
    final boolean isAdmin = currentUser.authorities().stream()
        .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
      throw new IllegalArgumentException("You do not have permission to delete this comment.");
    }

    comment.softDelete();
  }

  private String normalizeBody(String body) {
    if (!StringUtils.hasText(body)) {
      throw new IllegalArgumentException("body is required.");
    }
    final String normalized = body.trim();
    if (normalized.length() > 300) {
      throw new IllegalArgumentException("body must be <= 300 characters.");
    }
    if (URL_PATTERN.matcher(normalized).find()) {
      throw new IllegalArgumentException("URL is not allowed in comment body.");
    }
    return normalized;
  }

  private Post requirePublicPost(UUID postId) {
    final Post post = postRepository.findById(postId)
        .orElseThrow(() -> new NoSuchElementException("Post not found: " + postId));
    final String visibility = post.getVisibility() == null ? "" : post.getVisibility().trim().toUpperCase(Locale.ROOT);
    if (!COMMENTABLE_VISIBILITIES.contains(visibility)) {
      throw new IllegalArgumentException("Comments are available only for PUBLIC posts.");
    }
    return post;
  }

  private CommentResponse toResponse(Comment comment) {
    final UserAccount user = userAccountRepository.findById(comment.getUserId())
        .orElseThrow(() -> new NoSuchElementException("User not found: " + comment.getUserId()));
    return new CommentResponse(
        comment.getId(),
        comment.getPostId(),
        comment.getUserId(),
        user.getDisplayName(),
        userPhotoUrlResolver.resolve(user),
        comment.getBody(),
        comment.getCreatedAt(),
        comment.getUpdatedAt(),
        comment.getUpdatedAt() != null
    );
  }
}
