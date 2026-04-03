package com.giver.backend.user.repository;

import com.giver.backend.user.entity.Follow;
import com.giver.backend.user.entity.FollowId;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {

  boolean existsByIdFollowerIdAndIdFolloweeId(UUID followerId, UUID followeeId);
}
