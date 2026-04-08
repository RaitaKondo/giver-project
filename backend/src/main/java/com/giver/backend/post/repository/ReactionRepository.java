package com.giver.backend.post.repository;

import com.giver.backend.post.entity.Reaction;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

  Optional<Reaction> findByPostIdAndUserId(UUID postId, UUID userId);

  List<Reaction> findByPostIdInAndUserId(Collection<UUID> postIds, UUID userId);

  @Modifying
  void deleteByPostIdAndUserId(UUID postId, UUID userId);

  @Query("""
      select r.postId as postId, r.type as type, count(r) as count
      from Reaction r
      where r.postId in :postIds
      group by r.postId, r.type
      """)
  List<PostReactionCountView> countByPostIds(Collection<UUID> postIds);

  interface PostReactionCountView {
    UUID getPostId();
    String getType();
    long getCount();
  }
}
