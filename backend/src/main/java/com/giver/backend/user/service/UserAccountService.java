package com.giver.backend.user.service;

import com.giver.backend.user.dto.UpdateProfileRequest;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.FollowRepository;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import com.giver.backend.storage.GcsImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class UserAccountService {

  private final UserAccountRepository userAccountRepository;
  private final FollowRepository followRepository;
  private final GcsImageStorageService gcsImageStorageService;
  private final UserPhotoUrlResolver userPhotoUrlResolver;

  private static final long MAX_PROFILE_PHOTO_SIZE_BYTES = 5L * 1024L * 1024L;

  public UserAccountService(
      UserAccountRepository userAccountRepository,
      FollowRepository followRepository,
      GcsImageStorageService gcsImageStorageService,
      UserPhotoUrlResolver userPhotoUrlResolver
  ) {
    this.userAccountRepository = userAccountRepository;
    this.followRepository = followRepository;
    this.gcsImageStorageService = gcsImageStorageService;
    this.userPhotoUrlResolver = userPhotoUrlResolver;
  }

  @Transactional
  public UserAccount upsertFromFirebase(UpsertUserCommand command) {
    return userAccountRepository.findByFirebaseUid(command.firebaseUid())
        .map(existing -> {
          existing.updateProfile(
              resolveDisplayNameForExistingUser(existing, command),
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
    final String nextPhotoUrl = request.photoUrl() == null
        ? user.getPhotoUrl()
        : normalizeNullable(request.photoUrl());
    user.updateProfile(
        normalizeDisplayName(request.displayName(), user.getFirebaseUid(), request.email()),
        normalizeNullable(request.email()),
        nextPhotoUrl
    );
    return toResponse(user, false);
  }

  @Transactional
  public UserProfileResponse updateProfilePhoto(UUID userId, MultipartFile image) {
    validateProfileImage(image);
    final UserAccount user = requireById(userId);
    final GcsImageStorageService.StoredObject stored = gcsImageStorageService.storeProfileImage(userId, image);
    user.updateProfilePhotoObjectName(stored.objectName());
    return toResponse(user, false);
  }

  public UserProfileResponse toResponse(UserAccount user, boolean following) {
    return new UserProfileResponse(
        user.getId(),
        user.getDisplayName(),
        user.getEmail(),
        resolvePhotoUrl(user),
        user.getCreatedAt(),
        following
    );
  }

  public String resolvePhotoUrl(UserAccount user) {
    return userPhotoUrlResolver.resolve(user);
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

  private String resolveDisplayNameForExistingUser(UserAccount existing, UpsertUserCommand command) {
    if (StringUtils.hasText(existing.getDisplayName())) {
      return existing.getDisplayName().trim();
    }
    return normalizeDisplayName(command.displayName(), command.firebaseUid(), command.email());
  }

  private void validateProfileImage(MultipartFile image) {
    if (image == null || image.isEmpty()) {
      throw new IllegalArgumentException("Profile image file must not be empty.");
    }
    if (image.getSize() > MAX_PROFILE_PHOTO_SIZE_BYTES) {
      throw new IllegalArgumentException("Profile image must be <= 5MB.");
    }
    final String contentType = image.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new IllegalArgumentException("Only image/* content type is allowed.");
    }
  }

  public record UpsertUserCommand(
      String firebaseUid,
      String displayName,
      String email,
      String photoUrl
  ) {
  }
}
