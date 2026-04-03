package com.giver.backend.user.service;

import com.giver.backend.user.entity.Follow;
import com.giver.backend.user.entity.FollowId;
import com.giver.backend.user.repository.FollowRepository;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {

  private final FollowRepository followRepository;
  private final UserAccountRepository userAccountRepository;

  public FollowService(
      FollowRepository followRepository,
      UserAccountRepository userAccountRepository
  ) {
    this.followRepository = followRepository;
    this.userAccountRepository = userAccountRepository;
  }

  @Transactional
  public void follow(UUID followerId, UUID followeeId) {
    if (followerId.equals(followeeId)) {
      throw new IllegalArgumentException("You cannot follow yourself.");
    }
    userAccountRepository.findById(followeeId)
        .orElseThrow(() -> new IllegalArgumentException("Follow target does not exist."));
    if (!followRepository.existsByIdFollowerIdAndIdFolloweeId(followerId, followeeId)) {
      followRepository.save(new Follow(followerId, followeeId));
    }
  }

  @Transactional
  public void unfollow(UUID followerId, UUID followeeId) {
    followRepository.deleteById(new FollowId(followerId, followeeId));
  }
}
