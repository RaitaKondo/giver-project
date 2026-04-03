package com.giver.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookmarks")
public class Bookmark {

  @EmbeddedId
  private BookmarkId id;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  protected Bookmark() {
  }

  public Bookmark(UUID userId, UUID postId) {
    this.id = new BookmarkId(userId, postId);
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }
}
