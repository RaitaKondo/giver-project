package com.giver.backend.post.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "reactions")
public class Reaction {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "post_id", nullable = false, updatable = false)
  private UUID postId;

  @Column(name = "user_id", nullable = false, updatable = false)
  private UUID userId;

  @Column(name = "type", nullable = false)
  private String type;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  protected Reaction() {
  }

  public Reaction(UUID postId, UUID userId, String type) {
    this.id = UUID.randomUUID();
    this.postId = postId;
    this.userId = userId;
    this.type = type;
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public UUID getId() {
    return id;
  }

  public UUID getPostId() {
    return postId;
  }

  public UUID getUserId() {
    return userId;
  }

  public String getType() {
    return type;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
