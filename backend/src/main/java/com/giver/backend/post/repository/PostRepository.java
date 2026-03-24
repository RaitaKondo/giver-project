package com.giver.backend.post.repository;

import com.giver.backend.post.entity.Post;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, UUID> {

  @EntityGraph(attributePaths = {"images", "postContexts", "postContexts.contextMaster"})
  java.util.Optional<Post> findWithImagesById(UUID id);

  @EntityGraph(attributePaths = "images")
  Page<Post> findByVisibility(String visibility, Pageable pageable);

  @EntityGraph(attributePaths = "images")
  Page<Post> findAll(Pageable pageable);
}
