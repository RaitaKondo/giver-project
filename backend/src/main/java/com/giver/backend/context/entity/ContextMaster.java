package com.giver.backend.context.entity;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import com.giver.backend.post.entity.PostContext;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "context_master")
public class ContextMaster {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false, updatable = false)
  private Long id;

  @Column(name = "code", nullable = false, unique = true, length = 100)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "category", nullable = false, length = 50)
  private String category;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder;

  @Column(name = "is_active", nullable = false)
  private boolean isActive;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  @OneToMany(mappedBy = "contextMaster")
  private List<PostContext> postContexts = new ArrayList<>();

  protected ContextMaster() {
    // JPA用の no-args constructor
  }

  public ContextMaster(
      String code,
      String name,
      String category,
      int sortOrder,
      boolean isActive
  ) {
    this.code = code;
    this.name = name;
    this.category = category;
    this.sortOrder = sortOrder;
    this.isActive = isActive;
  }

  @PrePersist
  void prePersist() {
    final OffsetDateTime now = OffsetDateTime.now();
    if (createdAt == null) {
      createdAt = now;
    }
    if (updatedAt == null) {
      updatedAt = now;
    }
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = OffsetDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public String getCode() {
    return code;
  }

  public String getName() {
    return name;
  }

  public String getCategory() {
    return category;
  }

  public int getSortOrder() {
    return sortOrder;
  }

  public boolean isActive() {
    return isActive;
  }
}
