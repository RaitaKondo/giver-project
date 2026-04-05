package com.giver.backend.user.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.giver.backend.storage.GcsImageStorageService;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.entity.UserAccount;
import com.giver.backend.user.repository.FollowRepository;
import com.giver.backend.user.repository.UserAccountRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

  @Mock
  private UserAccountRepository userAccountRepository;

  @Mock
  private FollowRepository followRepository;

  @Mock
  private GcsImageStorageService gcsImageStorageService;

  @Mock
  private UserPhotoUrlResolver userPhotoUrlResolver;

  private UserAccountService userAccountService;

  @BeforeEach
  void setUp() {
    userAccountService = new UserAccountService(
        userAccountRepository,
        followRepository,
        gcsImageStorageService,
        userPhotoUrlResolver
    );
  }

  @Test
  void updateProfilePhoto_updatesObjectNameAndReturnsResolvedPhotoUrl() {
    final UserAccount user = new UserAccount("firebase-uid", "Test User", "test@example.com", null);
    final MockMultipartFile image = new MockMultipartFile(
        "image",
        "avatar.png",
        "image/png",
        new byte[] {1, 2, 3}
    );
    final String objectName = "users/%s/profile/avatar.png".formatted(user.getId());

    when(userAccountRepository.findById(user.getId())).thenReturn(Optional.of(user));
    when(gcsImageStorageService.storeProfileImage(eq(user.getId()), any()))
        .thenReturn(new GcsImageStorageService.StoredObject("bucket", objectName, "image/png"));
    when(userPhotoUrlResolver.resolve(user)).thenReturn("https://cdn.example.com/users/avatar.png");

    final UserProfileResponse response = userAccountService.updateProfilePhoto(user.getId(), image);

    assertThat(user.getProfilePhotoObjectName()).isEqualTo(objectName);
    assertThat(response.photoUrl()).isEqualTo("https://cdn.example.com/users/avatar.png");
  }

  @Test
  void updateProfilePhoto_throwsWhenImageExceeds5Mb() {
    final byte[] tooLarge = new byte[5 * 1024 * 1024 + 1];
    final MockMultipartFile image = new MockMultipartFile(
        "image",
        "avatar.png",
        "image/png",
        tooLarge
    );

    assertThatThrownBy(() -> userAccountService.updateProfilePhoto(java.util.UUID.randomUUID(), image))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Profile image must be <= 5MB.");
  }

  @Test
  void updateProfilePhoto_throwsWhenContentTypeIsNotImage() {
    final MockMultipartFile image = new MockMultipartFile(
        "image",
        "avatar.txt",
        "text/plain",
        "not-image".getBytes()
    );

    assertThatThrownBy(() -> userAccountService.updateProfilePhoto(java.util.UUID.randomUUID(), image))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Only image/* content type is allowed.");
  }
}
