package com.giver.backend.post.repository;

import com.giver.backend.post.entity.Comment;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

  List<Comment> findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(UUID postId);

  Optional<Comment> findByIdAndDeletedAtIsNull(UUID id);

  @Query("""
      select c.postId as postId, count(c) as count
      from Comment c
      where c.postId in :postIds and c.deletedAt is null
      group by c.postId
      """)
  List<PostCommentCountView> countByPostIds(Collection<UUID> postIds);

  interface PostCommentCountView {
    UUID getPostId();
    long getCount();
  }
}
