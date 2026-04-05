package com.giver.backend.user.repository;

import com.giver.backend.user.entity.Follow;
import com.giver.backend.user.entity.FollowId;
import com.giver.backend.user.entity.UserAccount;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {

  boolean existsByIdFollowerIdAndIdFolloweeId(UUID followerId, UUID followeeId);

  long countByIdFollowerId(UUID followerId);

  long countByIdFolloweeId(UUID followeeId);

  @Query("""
      select user
      from UserAccount user
      join Follow follow on follow.id.followeeId = user.id
      where follow.id.followerId = :followerId
      order by user.displayName asc
      """)
  java.util.List<UserAccount> findFolloweesByFollowerId(UUID followerId);

  @Query("""
      select user
      from UserAccount user
      join Follow follow on follow.id.followerId = user.id
      where follow.id.followeeId = :followeeId
      order by user.displayName asc
      """)
  java.util.List<UserAccount> findFollowersByFolloweeId(UUID followeeId);
}
