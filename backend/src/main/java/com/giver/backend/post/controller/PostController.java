package com.giver.backend.post.controller;

import com.giver.backend.post.dto.request.CreatePostRequest;
import com.giver.backend.post.dto.request.SearchPostsRequest;
import com.giver.backend.post.dto.response.PostResponse;
import com.giver.backend.post.dto.response.PostSummaryResponse;
import com.giver.backend.post.service.PostCommandService;
import com.giver.backend.post.service.PostQueryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/posts")
public class PostController {

  private final PostCommandService postCommandService;
  private final PostQueryService postQueryService;
  private final ObjectMapper objectMapper;
  private final Validator validator;

  public PostController(
      PostCommandService postCommandService,
      PostQueryService postQueryService,
      ObjectMapper objectMapper,
      Validator validator
  ) {
    this.postCommandService = postCommandService;
    this.postQueryService = postQueryService;
    this.objectMapper = objectMapper;
    this.validator = validator;
  }

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<PostResponse> create(
      // multipart の受け取り方:
      // - request パートは JSON 文字列で受け取り、ObjectMapper で DTO 化する。
      @RequestPart("request") String requestJson,
      // images パートは複数ファイルを受け取る。省略可能なので required = false とする。
      @RequestPart(value = "images", required = false) List<MultipartFile> images
  ) throws JsonProcessingException {
    final CreatePostRequest request = parseRequest(requestJson);
    validateRequest(request);

    final PostResponse response = postCommandService.create(request, images);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<PostResponse> findById(@PathVariable("id") UUID id) {
    final PostResponse response = postQueryService.findById(id);
    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<Page<PostSummaryResponse>> search(
      @RequestParam(value = "visibility", required = false) String visibility,
      @RequestParam(value = "page", required = false) Integer page,
      @RequestParam(value = "size", required = false) Integer size
  ) {
    // 一覧検索は Controller で query param を DTO にまとめ、
    // 正規化・検証ルールは Service へ寄せて責務分離する。
    final SearchPostsRequest request = new SearchPostsRequest(visibility, page, size);
    return ResponseEntity.ok(postQueryService.search(request));
  }

  private CreatePostRequest parseRequest(String requestJson) throws JsonProcessingException {
    // 例外処理の意図:
    // - JSON 変換失敗は GlobalExceptionHandler 側で 400 に寄せる。
    return objectMapper.readValue(requestJson, CreatePostRequest.class);
  }

  private void validateRequest(CreatePostRequest request) {
    // バリデーションの意図:
    // - @RequestPart String 経由では自動バリデーションされないため、明示的に Validator を実行する。
    final Set<ConstraintViolation<CreatePostRequest>> violations = validator.validate(request);
    if (!violations.isEmpty()) {
      throw new ConstraintViolationException(violations);
    }
  }
}
