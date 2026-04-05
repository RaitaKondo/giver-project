package com.giver.backend.user.controller;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.post.dto.response.PostSummaryResponse;
import com.giver.backend.post.service.PostQueryService;
import com.giver.backend.user.dto.FollowOverviewResponse;
import com.giver.backend.user.dto.UpdateProfileRequest;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.service.FollowService;
import com.giver.backend.user.service.UserAccountService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/me")
public class MeController {

  private final CurrentUserService currentUserService;
  private final UserAccountService userAccountService;
  private final PostQueryService postQueryService;
  private final FollowService followService;

  public MeController(
      CurrentUserService currentUserService,
      UserAccountService userAccountService,
      PostQueryService postQueryService,
      FollowService followService
  ) {
    this.currentUserService = currentUserService;
    this.userAccountService = userAccountService;
    this.postQueryService = postQueryService;
    this.followService = followService;
  }

  @GetMapping("/profile")
  public ResponseEntity<UserProfileResponse> profile() {
    final var currentUser = currentUserService.requireCurrentUser();
    return ResponseEntity.ok(userAccountService.getProfile(currentUser.userId(), currentUser.userId()));
  }

  @PatchMapping("/profile")
  public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
    return ResponseEntity.ok(userAccountService.updateProfile(currentUserService.requireCurrentUserId(), request));
  }

  @PatchMapping(value = "/profile/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<UserProfileResponse> updateProfilePhoto(
      @RequestPart("image") MultipartFile image
  ) {
    return ResponseEntity.ok(userAccountService.updateProfilePhoto(currentUserService.requireCurrentUserId(), image));
  }

  @GetMapping("/posts")
  public ResponseEntity<Page<PostSummaryResponse>> myPosts(
      @RequestParam(value = "page", required = false) Integer page,
      @RequestParam(value = "size", required = false) Integer size
  ) {
    return ResponseEntity.ok(postQueryService.findMyPosts(currentUserService.requireCurrentUserId(), page, size));
  }

  @GetMapping("/feed")
  public ResponseEntity<Page<PostSummaryResponse>> feed(
      @RequestParam(value = "page", required = false) Integer page,
      @RequestParam(value = "size", required = false) Integer size
  ) {
    return ResponseEntity.ok(
        postQueryService.findFeedPosts(
            followService.getFolloweeIds(currentUserService.requireCurrentUserId()),
            page,
            size
        )
    );
  }

  @GetMapping("/follows")
  public ResponseEntity<FollowOverviewResponse> follows() {
    return ResponseEntity.ok(followService.getOverview(currentUserService.requireCurrentUserId()));
  }
}
