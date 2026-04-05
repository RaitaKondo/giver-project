package com.giver.backend.user.service;

import com.giver.backend.user.dto.FollowOverviewResponse;
import com.giver.backend.user.dto.FollowUserResponse;
import com.giver.backend.user.entity.Follow;
import com.giver.backend.user.entity.FollowId;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.FollowRepository;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {

  private final FollowRepository followRepository;
  private final UserAccountRepository userAccountRepository;
  private final UserPhotoUrlResolver userPhotoUrlResolver;

  public FollowService(
      FollowRepository followRepository,
      UserAccountRepository userAccountRepository,
      UserPhotoUrlResolver userPhotoUrlResolver
  ) {
    this.followRepository = followRepository;
    this.userAccountRepository = userAccountRepository;
    this.userPhotoUrlResolver = userPhotoUrlResolver;
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

  @Transactional(readOnly = true)
  public FollowOverviewResponse getOverview(UUID currentUserId) {
    final long followingCount = followRepository.countByIdFollowerId(currentUserId);
    final long followerCount = followRepository.countByIdFolloweeId(currentUserId);
    final List<FollowUserResponse> followingUsers = followRepository.findFolloweesByFollowerId(currentUserId).stream()
        .map(user -> toResponse(user, true))
        .toList();
    final List<FollowUserResponse> followerUsers = followRepository.findFollowersByFolloweeId(currentUserId).stream()
        .map(user -> toResponse(
            user,
            followRepository.existsByIdFollowerIdAndIdFolloweeId(currentUserId, user.getId())
        ))
        .toList();

    return new FollowOverviewResponse(followingCount, followerCount, followingUsers, followerUsers);
  }

  @Transactional(readOnly = true)
  public List<UUID> getFolloweeIds(UUID currentUserId) {
    return followRepository.findFolloweesByFollowerId(currentUserId).stream()
        .map(UserAccount::getId)
        .toList();
  }

  private FollowUserResponse toResponse(UserAccount user, boolean following) {
    return new FollowUserResponse(
        user.getId(),
        user.getDisplayName(),
        user.getEmail(),
        userPhotoUrlResolver.resolve(user),
        following
    );
  }
}
