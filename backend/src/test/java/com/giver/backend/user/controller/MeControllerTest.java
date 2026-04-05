package com.giver.backend.user.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.auth.FirebaseAuthenticationFilter;
import com.giver.backend.post.service.PostQueryService;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.service.FollowService;
import com.giver.backend.user.service.UserAccountService;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MeController.class)
@AutoConfigureMockMvc(addFilters = false)
class MeControllerTest {

  private static final UUID USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private CurrentUserService currentUserService;

  @MockitoBean
  private UserAccountService userAccountService;

  @MockitoBean
  private PostQueryService postQueryService;

  @MockitoBean
  private FollowService followService;

  @MockitoBean
  private FirebaseAuthenticationFilter firebaseAuthenticationFilter;

  @Test
  void updateProfilePhoto_returns200_whenMultipartImageIsValid() throws Exception {
    final UserProfileResponse response = new UserProfileResponse(
        USER_ID,
        "Test User",
        "test@example.com",
        "https://cdn.example.com/users/avatar.png",
        OffsetDateTime.now(),
        false
    );

    when(currentUserService.requireCurrentUserId()).thenReturn(USER_ID);
    when(userAccountService.updateProfilePhoto(eq(USER_ID), any())).thenReturn(response);

    final MockMultipartFile imagePart = new MockMultipartFile(
        "image",
        "avatar.png",
        "image/png",
        "dummy".getBytes(StandardCharsets.UTF_8)
    );

    mockMvc.perform(
            multipart("/api/me/profile/photo")
                .file(imagePart)
                .with(request -> {
                  request.setMethod("PATCH");
                  return request;
                })
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.photoUrl").value("https://cdn.example.com/users/avatar.png"));
  }
}
