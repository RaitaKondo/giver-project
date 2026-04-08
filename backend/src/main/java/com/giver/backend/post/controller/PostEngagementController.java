package com.giver.backend.post.controller;

import com.giver.backend.post.dto.request.CreateCommentRequest;
import com.giver.backend.post.dto.request.ToggleReactionRequest;
import com.giver.backend.post.dto.request.UpdateCommentRequest;
import com.giver.backend.post.dto.response.CommentResponse;
import com.giver.backend.post.dto.response.ReactionSummaryResponse;
import com.giver.backend.post.service.CommentService;
import com.giver.backend.post.service.ReactionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PostEngagementController {

  private final CommentService commentService;
  private final ReactionService reactionService;

  public PostEngagementController(
      CommentService commentService,
      ReactionService reactionService
  ) {
    this.commentService = commentService;
    this.reactionService = reactionService;
  }

  @GetMapping("/posts/{id}/comments")
  public ResponseEntity<List<CommentResponse>> listComments(@PathVariable("id") UUID postId) {
    return ResponseEntity.ok(commentService.list(postId));
  }

  @PostMapping("/posts/{id}/comments")
  public ResponseEntity<CommentResponse> createComment(
      @PathVariable("id") UUID postId,
      @Valid @RequestBody CreateCommentRequest request
  ) {
    return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(postId, request));
  }

  @PatchMapping("/comments/{id}")
  public ResponseEntity<CommentResponse> updateComment(
      @PathVariable("id") UUID commentId,
      @Valid @RequestBody UpdateCommentRequest request
  ) {
    return ResponseEntity.ok(commentService.update(commentId, request));
  }

  @DeleteMapping("/comments/{id}")
  public ResponseEntity<Void> deleteComment(@PathVariable("id") UUID commentId) {
    commentService.delete(commentId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/posts/{id}/reactions")
  public ResponseEntity<ReactionSummaryResponse> toggleReaction(
      @PathVariable("id") UUID postId,
      @Valid @RequestBody ToggleReactionRequest request
  ) {
    return ResponseEntity.ok(reactionService.toggle(postId, request));
  }
}
