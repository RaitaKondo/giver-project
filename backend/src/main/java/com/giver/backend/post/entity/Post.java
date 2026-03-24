package com.giver.backend.post.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.giver.backend.context.entity.ContextMaster;

@Entity
@Table(name = "posts")
public class Post {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "author_id", nullable = false)
  private UUID authorId;

  @Column(name = "title")
  private String title;

  @Column(name = "action_text", nullable = false)
  private String actionText;

  @Column(name = "conflict_text")
  private String conflictText;

  @Column(name = "change_text")
  private String changeText;

  @Column(name = "visibility", nullable = false)
  private String visibility;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  // Post は集約ルートとして画像コレクションを管理し、関連の整合性を保つ責務を持つ。
  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PostImage> images = new ArrayList<>();

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PostContext> postContexts = new ArrayList<>();

  protected Post() {
    // JPA用の no-args constructor
  }

  public Post(
      UUID authorId,
      String title,
      String actionText,
      String conflictText,
      String changeText,
      String visibility
  ) {
    this.id = UUID.randomUUID();
    this.authorId = authorId;
    this.title = title;
    this.actionText = actionText;
    this.conflictText = conflictText;
    this.changeText = changeText;
    this.visibility = visibility;
  }

  @PrePersist
  void prePersist() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public void addImage(PostImage image) {
    images.add(image);
    image.assignPost(this);
  }

  public void addContext(ContextMaster contextMaster) {
    final PostContext postContext = new PostContext(this, contextMaster);
    postContexts.add(postContext);
  }

  public UUID getId() {
    return id;
  }

  public UUID getAuthorId() {
    return authorId;
  }

  public String getTitle() {
    return title;
  }

  public String getActionText() {
    return actionText;
  }

  public String getConflictText() {
    return conflictText;
  }

  public String getChangeText() {
    return changeText;
  }

  public String getVisibility() {
    return visibility;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public List<PostImage> getImages() {
    return images;
  }

  public List<PostContext> getPostContexts() {
    return postContexts;
  }
}
