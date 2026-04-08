package com.giver.backend.post.service;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.post.dto.request.ToggleReactionRequest;
import com.giver.backend.post.dto.response.ReactionSummaryResponse;
import com.giver.backend.post.entity.Post;
import com.giver.backend.post.entity.Reaction;
import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.post.repository.ReactionRepository;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReactionService {

  private static final Set<String> REACTABLE_VISIBILITIES = Set.of("PUBLIC");

  private final ReactionRepository reactionRepository;
  private final PostRepository postRepository;
  private final CurrentUserService currentUserService;
  private final PostEngagementQueryService postEngagementQueryService;

  public ReactionService(
      ReactionRepository reactionRepository,
      PostRepository postRepository,
      CurrentUserService currentUserService,
      PostEngagementQueryService postEngagementQueryService
  ) {
    this.reactionRepository = reactionRepository;
    this.postRepository = postRepository;
    this.currentUserService = currentUserService;
    this.postEngagementQueryService = postEngagementQueryService;
  }

  @Transactional
  public ReactionSummaryResponse toggle(UUID postId, ToggleReactionRequest request) {
    requirePublicPost(postId);
    final UUID userId = currentUserService.requireCurrentUserId();
    final String type = normalizeType(request.type());

    final java.util.Optional<Reaction> existing = reactionRepository.findByPostIdAndUserId(postId, userId);
    if (existing.isPresent() && existing.get().getType().equals(type)) {
      reactionRepository.delete(existing.get());
      return postEngagementQueryService.summarizeForPost(postId, userId);
    }

    reactionRepository.deleteByPostIdAndUserId(postId, userId);
    reactionRepository.save(new Reaction(postId, userId, type));
    return postEngagementQueryService.summarizeForPost(postId, userId);
  }

  private String normalizeType(String type) {
    if (type == null || type.isBlank()) {
      throw new IllegalArgumentException("reaction type is required.");
    }
    final String normalized = type.trim().toLowerCase(Locale.ROOT);
    if (!PostEngagementQueryService.ALLOWED_REACTIONS.contains(normalized)) {
      throw new IllegalArgumentException(
          "reaction type must be one of: " + PostEngagementQueryService.REACTION_TYPES
      );
    }
    return normalized;
  }

  private Post requirePublicPost(UUID postId) {
    final Post post = postRepository.findById(postId)
        .orElseThrow(() -> new NoSuchElementException("Post not found: " + postId));
    final String visibility = post.getVisibility() == null ? "" : post.getVisibility().trim().toUpperCase(Locale.ROOT);
    if (!REACTABLE_VISIBILITIES.contains(visibility)) {
      throw new IllegalArgumentException("Reactions are available only for PUBLIC posts.");
    }
    return post;
  }
}
