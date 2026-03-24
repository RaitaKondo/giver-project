package com.giver.backend.post.entity;

import java.time.OffsetDateTime;

import com.giver.backend.context.entity.ContextMaster;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_contexts")
public class PostContext {

  @EmbeddedId
  private PostContextId id;

  @MapsId("postId")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @MapsId("contextId")
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "context_id", nullable = false)
  private ContextMaster contextMaster;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  protected PostContext() {
    // JPA用の no-args constructor
  }

  public PostContext(Post post, ContextMaster contextMaster) {
    this.post = post;
    this.contextMaster = contextMaster;
    this.id = new PostContextId(post.getId(), contextMaster.getId());
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public PostContextId getId() {
    return id;
  }

  public Post getPost() {
    return post;
  }

  public ContextMaster getContextMaster() {
    return contextMaster;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
