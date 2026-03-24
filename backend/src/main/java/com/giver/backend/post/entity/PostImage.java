package com.giver.backend.post.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "post_images")
public class PostImage {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  // PostImage は DB には object_name を保持し、配信URLは都度署名付きで生成する責務分離を前提にする。
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @Column(name = "object_name", nullable = false)
  private String objectName;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  protected PostImage() {
    // JPA用の no-args constructor
  }

  public PostImage(String objectName, int sortOrder) {
    this.id = UUID.randomUUID();
    this.objectName = objectName;
    this.sortOrder = sortOrder;
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  void assignPost(Post post) {
    this.post = post;
  }

  public UUID getId() {
    return id;
  }

  public Post getPost() {
    return post;
  }

  public String getObjectName() {
    return objectName;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
