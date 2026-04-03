package com.giver.backend.user.service;

import com.giver.backend.user.dto.UpdateProfileRequest;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.FollowRepository;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserAccountService {

  private final UserAccountRepository userAccountRepository;
  private final FollowRepository followRepository;

  public UserAccountService(
      UserAccountRepository userAccountRepository,
      FollowRepository followRepository
  ) {
    this.userAccountRepository = userAccountRepository;
    this.followRepository = followRepository;
  }

  @Transactional
  public UserAccount upsertFromFirebase(UpsertUserCommand command) {
    return userAccountRepository.findByFirebaseUid(command.firebaseUid())
        .map(existing -> {
          existing.updateProfile(
              normalizeDisplayName(command.displayName(), command.firebaseUid(), command.email()),
              normalizeNullable(command.email()),
              normalizeNullable(command.photoUrl())
          );
          return existing;
        })
        .orElseGet(() -> userAccountRepository.save(new UserAccount(
            command.firebaseUid(),
            normalizeDisplayName(command.displayName(), command.firebaseUid(), command.email()),
            normalizeNullable(command.email()),
            normalizeNullable(command.photoUrl())
        )));
  }

  @Transactional(readOnly = true)
  public UserAccount requireById(UUID userId) {
    return userAccountRepository.findById(userId)
        .orElseThrow(() -> new NoSuchElementException("User not found: " + userId));
  }

  @Transactional(readOnly = true)
  public UserProfileResponse getProfile(UUID userId, UUID viewerUserId) {
    final UserAccount user = requireById(userId);
    final boolean following = viewerUserId != null
        && !viewerUserId.equals(userId)
        && followRepository.existsByIdFollowerIdAndIdFolloweeId(viewerUserId, userId);
    return toResponse(user, following);
  }

  @Transactional
  public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
    final UserAccount user = requireById(userId);
    user.updateProfile(
        normalizeDisplayName(request.displayName(), user.getFirebaseUid(), request.email()),
        normalizeNullable(request.email()),
        normalizeNullable(request.photoUrl())
    );
    return toResponse(user, false);
  }

  public UserProfileResponse toResponse(UserAccount user, boolean following) {
    return new UserProfileResponse(
        user.getId(),
        user.getDisplayName(),
        user.getEmail(),
        user.getPhotoUrl(),
        user.getCreatedAt(),
        following
    );
  }

  private String normalizeDisplayName(String value, String firebaseUid, String email) {
    if (StringUtils.hasText(value)) {
      return value.trim();
    }
    if (StringUtils.hasText(email)) {
      return email.trim().split("@")[0];
    }
    return firebaseUid;
  }

  private String normalizeNullable(String value) {
    return StringUtils.hasText(value) ? value.trim() : null;
  }

  public record UpsertUserCommand(
      String firebaseUid,
      String displayName,
      String email,
      String photoUrl
  ) {
  }
}
