package com.giver.backend.user.controller;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.service.UserAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final CurrentUserService currentUserService;
  private final UserAccountService userAccountService;

  public AuthController(
      CurrentUserService currentUserService,
      UserAccountService userAccountService
  ) {
    this.currentUserService = currentUserService;
    this.userAccountService = userAccountService;
  }

  @GetMapping("/me")
  public ResponseEntity<UserProfileResponse> me() {
    final var currentUser = currentUserService.requireCurrentUser();
    return ResponseEntity.ok(userAccountService.getProfile(currentUser.userId(), currentUser.userId()));
  }
}
