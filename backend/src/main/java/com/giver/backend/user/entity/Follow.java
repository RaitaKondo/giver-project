package com.giver.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "follows")
public class Follow {

  @EmbeddedId
  private FollowId id;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  protected Follow() {
  }

  public Follow(UUID followerId, UUID followeeId) {
    this.id = new FollowId(followerId, followeeId);
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }
}
