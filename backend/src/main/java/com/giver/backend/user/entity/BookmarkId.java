package com.giver.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class BookmarkId implements Serializable {

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(name = "post_id", nullable = false)
  private UUID postId;

  protected BookmarkId() {
  }

  public BookmarkId(UUID userId, UUID postId) {
    this.userId = userId;
    this.postId = postId;
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof BookmarkId other)) {
      return false;
    }
    return Objects.equals(userId, other.userId) && Objects.equals(postId, other.postId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, postId);
  }
}
