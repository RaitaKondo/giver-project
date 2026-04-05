package com.giver.backend.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class FollowId implements Serializable {

  @Column(name = "follower_id", nullable = false)
  private UUID followerId;

  @Column(name = "followee_id", nullable = false)
  private UUID followeeId;

  protected FollowId() {
  }

  public FollowId(UUID followerId, UUID followeeId) {
    this.followerId = followerId;
    this.followeeId = followeeId;
  }

  @Override
  public boolean equals(Object object) {
    if (this == object) {
      return true;
    }
    if (!(object instanceof FollowId other)) {
      return false;
    }
    return Objects.equals(followerId, other.followerId) && Objects.equals(followeeId, other.followeeId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(followerId, followeeId);
  }
}
