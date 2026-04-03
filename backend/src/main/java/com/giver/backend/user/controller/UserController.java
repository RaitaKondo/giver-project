package com.giver.backend.user.controller;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.post.dto.response.PostSummaryResponse;
import com.giver.backend.post.service.PostQueryService;
import com.giver.backend.user.dto.UserProfileResponse;
import com.giver.backend.user.service.BookmarkService;
import com.giver.backend.user.service.FollowService;
import com.giver.backend.user.service.UserAccountService;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

  private final CurrentUserService currentUserService;
  private final UserAccountService userAccountService;
  private final PostQueryService postQueryService;
  private final FollowService followService;
  private final BookmarkService bookmarkService;

  public UserController(
      CurrentUserService currentUserService,
      UserAccountService userAccountService,
      PostQueryService postQueryService,
      FollowService followService,
      BookmarkService bookmarkService
  ) {
    this.currentUserService = currentUserService;
    this.userAccountService = userAccountService;
    this.postQueryService = postQueryService;
    this.followService = followService;
    this.bookmarkService = bookmarkService;
  }

  @GetMapping("/users/{id}")
  public ResponseEntity<UserProfileResponse> getUser(@PathVariable("id") UUID userId) {
    return ResponseEntity.ok(userAccountService.getProfile(userId, currentUserService.getCurrentUserIdOrNull()));
  }

  @GetMapping("/users/{id}/posts")
  public ResponseEntity<Page<PostSummaryResponse>> getUserPosts(
      @PathVariable("id") UUID userId,
      @RequestParam(value = "page", required = false) Integer page,
      @RequestParam(value = "size", required = false) Integer size
  ) {
    return ResponseEntity.ok(postQueryService.findPublicPostsByAuthor(userId, page, size));
  }

  @PostMapping("/users/{id}/follow")
  public ResponseEntity<Void> follow(@PathVariable("id") UUID followeeId) {
    followService.follow(currentUserService.requireCurrentUserId(), followeeId);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/users/{id}/follow")
  public ResponseEntity<Void> unfollow(@PathVariable("id") UUID followeeId) {
    followService.unfollow(currentUserService.requireCurrentUserId(), followeeId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/posts/{id}/bookmark")
  public ResponseEntity<Void> bookmark(@PathVariable("id") UUID postId) {
    bookmarkService.bookmark(currentUserService.requireCurrentUserId(), postId);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/posts/{id}/bookmark")
  public ResponseEntity<Void> removeBookmark(@PathVariable("id") UUID postId) {
    bookmarkService.removeBookmark(currentUserService.requireCurrentUserId(), postId);
    return ResponseEntity.noContent().build();
  }
}
