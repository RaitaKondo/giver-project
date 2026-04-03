package com.giver.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserAccount {

  @Id
  @Column(name = "id", nullable = false, updatable = false)
  private UUID id;

  @Column(name = "firebase_uid", nullable = false, unique = true)
  private String firebaseUid;

  @Column(name = "display_name", nullable = false)
  private String displayName;

  @Column(name = "email")
  private String email;

  @Column(name = "photo_url")
  private String photoUrl;

  @Column(name = "created_at", nullable = false, updatable = false)
  private OffsetDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private OffsetDateTime updatedAt;

  protected UserAccount() {
  }

  public UserAccount(String firebaseUid, String displayName, String email, String photoUrl) {
    this.id = UUID.randomUUID();
    this.firebaseUid = firebaseUid;
    this.displayName = displayName;
    this.email = email;
    this.photoUrl = photoUrl;
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

  public void updateProfile(String displayName, String email, String photoUrl) {
    this.displayName = displayName;
    this.email = email;
    this.photoUrl = photoUrl;
  }

  public UUID getId() {
    return id;
  }

  public String getFirebaseUid() {
    return firebaseUid;
  }

  public String getDisplayName() {
    return displayName;
  }

  public String getEmail() {
    return email;
  }

  public String getPhotoUrl() {
    return photoUrl;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }
}
