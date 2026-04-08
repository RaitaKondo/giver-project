package com.giver.backend.post.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comment {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "post_id", nullable = false, updatable = false)
  private UUID postId;

  @Column(name = "user_id", nullable = false, updatable = false)
  private UUID userId;

  @Column(name = "body", nullable = false)
  private String body;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at")
  private OffsetDateTime updatedAt;

  @Column(name = "deleted_at")
  private OffsetDateTime deletedAt;

  protected Comment() {
  }

  public Comment(UUID postId, UUID userId, String body) {
    this.id = UUID.randomUUID();
    this.postId = postId;
    this.userId = userId;
    this.body = body;
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public void updateBody(String nextBody) {
    this.body = nextBody;
    this.updatedAt = OffsetDateTime.now();
  }

  public void softDelete() {
    final OffsetDateTime now = OffsetDateTime.now();
    this.deletedAt = now;
    this.updatedAt = now;
  }

  public boolean isDeleted() {
    return deletedAt != null;
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

  public String getBody() {
    return body;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public OffsetDateTime getDeletedAt() {
    return deletedAt;
  }
}
