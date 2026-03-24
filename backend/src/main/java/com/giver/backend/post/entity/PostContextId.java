package com.giver.backend.post.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PostContextId implements Serializable {

  @Column(name = "post_id", nullable = false)
  private UUID postId;

  @Column(name = "context_id", nullable = false)
  private Long contextId;

  protected PostContextId() {
    // JPA用の no-args constructor
  }

  public PostContextId(UUID postId, Long contextId) {
    this.postId = postId;
    this.contextId = contextId;
  }

  public UUID getPostId() {
    return postId;
  }

  public Long getContextId() {
    return contextId;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    }
    if (!(other instanceof PostContextId that)) {
      return false;
    }
    return Objects.equals(postId, that.postId) && Objects.equals(contextId, that.contextId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(postId, contextId);
  }
}
