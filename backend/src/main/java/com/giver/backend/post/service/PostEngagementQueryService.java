package com.giver.backend.post.service;

import com.giver.backend.post.dto.response.ReactionSummaryResponse;
import com.giver.backend.post.repository.CommentRepository;
import com.giver.backend.post.repository.ReactionRepository;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PostEngagementQueryService {

  public static final List<String> REACTION_TYPES = List.of("like", "thanks", "empathize", "inspiring");
  public static final Set<String> ALLOWED_REACTIONS = Set.copyOf(REACTION_TYPES);

  private final ReactionRepository reactionRepository;
  private final CommentRepository commentRepository;

  public PostEngagementQueryService(
      ReactionRepository reactionRepository,
      CommentRepository commentRepository
  ) {
    this.reactionRepository = reactionRepository;
    this.commentRepository = commentRepository;
  }

  public ReactionSummaryResponse summarizeForPost(UUID postId, UUID viewerUserId) {
    return summarizeForPosts(List.of(postId), viewerUserId).getOrDefault(postId, emptySummary());
  }

  public Map<UUID, ReactionSummaryResponse> summarizeForPosts(Collection<UUID> postIds, UUID viewerUserId) {
    if (postIds == null || postIds.isEmpty()) {
      return Map.of();
    }

    final Map<UUID, Map<String, Long>> reactionCountsByPostId = new LinkedHashMap<>();
    for (UUID postId : postIds) {
      reactionCountsByPostId.put(postId, emptyReactionCounts());
    }

    reactionRepository.countByPostIds(postIds).forEach(row -> {
      reactionCountsByPostId.computeIfAbsent(row.getPostId(), ignored -> emptyReactionCounts())
          .put(row.getType(), row.getCount());
    });

    final Map<UUID, Long> commentCountByPostId = new LinkedHashMap<>();
    commentRepository.countByPostIds(postIds).forEach(row -> commentCountByPostId.put(row.getPostId(), row.getCount()));

    final Map<UUID, String> myReactionByPostId = new LinkedHashMap<>();
    if (viewerUserId != null) {
      reactionRepository.findByPostIdInAndUserId(postIds, viewerUserId)
          .forEach(reaction -> myReactionByPostId.put(reaction.getPostId(), reaction.getType()));
    }

    final Map<UUID, ReactionSummaryResponse> result = new LinkedHashMap<>();
    for (UUID postId : postIds) {
      result.put(
          postId,
          new ReactionSummaryResponse(
              reactionCountsByPostId.getOrDefault(postId, emptyReactionCounts()),
              myReactionByPostId.get(postId),
              commentCountByPostId.getOrDefault(postId, 0L)
          )
      );
    }
    return result;
  }

  private ReactionSummaryResponse emptySummary() {
    return new ReactionSummaryResponse(emptyReactionCounts(), null, 0L);
  }

  private Map<String, Long> emptyReactionCounts() {
    final Map<String, Long> counts = new LinkedHashMap<>();
    for (String reactionType : REACTION_TYPES) {
      counts.put(reactionType, 0L);
    }
    return counts;
  }
}
