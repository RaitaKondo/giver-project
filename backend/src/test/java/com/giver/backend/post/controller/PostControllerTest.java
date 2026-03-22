package com.giver.backend.post.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.giver.backend.post.dto.request.CreatePostRequest;
import com.giver.backend.post.dto.request.SearchPostsRequest;
import com.giver.backend.post.dto.response.PostImageResponse;
import com.giver.backend.post.dto.response.PostResponse;
import com.giver.backend.post.dto.response.PostSummaryResponse;
import com.giver.backend.post.service.PostCommandService;
import com.giver.backend.post.service.PostQueryService;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PostController.class)
class PostControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private PostCommandService postCommandService;

  @MockitoBean
  private PostQueryService postQueryService;

  @Test
  void createPost_returns201_whenMultipartRequestIsValid() throws Exception {
    // multipart の受け取り確認:
    // request パート(JSON) + images パート(複数ファイル)の組み合わせで 201 を返せることを確認する。
    final UUID postId = UUID.randomUUID();
    final PostResponse response = new PostResponse(
        postId,
        UUID.fromString("00000000-0000-0000-0000-000000000001"),
        "title",
        "action",
        "conflict",
        "change",
        "PUBLIC",
        OffsetDateTime.now(),
        List.of(new PostImageResponse(UUID.randomUUID(), "https://example.com/signed", 0))
    );

    when(postCommandService.create(any(CreatePostRequest.class), any())).thenReturn(response);

    final MockMultipartFile requestPart = new MockMultipartFile(
        "request",
        "",
        MediaType.APPLICATION_JSON_VALUE,
        """
        {"title":"test","actionText":"do action","conflictText":"c","changeText":"d","visibility":"PUBLIC"}
        """.getBytes(StandardCharsets.UTF_8)
    );
    final MockMultipartFile imagePart = new MockMultipartFile(
        "images",
        "sample.jpg",
        "image/jpeg",
        "dummy".getBytes(StandardCharsets.UTF_8)
    );

    mockMvc.perform(multipart("/api/posts")
            .file(requestPart)
            .file(imagePart))
        .andExpect(status().isCreated());
  }

  @Test
  void createPost_returns400_whenActionTextIsBlank() throws Exception {
    // actionText は DTO バリデーションで必須のため、blank は service 呼び出し前に 400 を返す。
    final MockMultipartFile requestPart = new MockMultipartFile(
        "request",
        "",
        MediaType.APPLICATION_JSON_VALUE,
        """
        {"title":"test","actionText":" ","visibility":"PUBLIC"}
        """.getBytes(StandardCharsets.UTF_8)
    );

    mockMvc.perform(multipart("/api/posts").file(requestPart))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createPost_returns400_whenMoreThan4Images() throws Exception {
    // 枚数上限は Service で業務ルールとして判定するため、ここでは IllegalArgumentException を 400 へ変換できるかを確認。
    when(postCommandService.create(any(CreatePostRequest.class), any()))
        .thenThrow(new IllegalArgumentException("Up to 4 images are allowed."));

    final MockMultipartFile requestPart = new MockMultipartFile(
        "request",
        "",
        MediaType.APPLICATION_JSON_VALUE,
        """
        {"title":"test","actionText":"do action","visibility":"PUBLIC"}
        """.getBytes(StandardCharsets.UTF_8)
    );

    mockMvc.perform(multipart("/api/posts").file(requestPart))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createPost_returns400_whenVisibilityIsInvalid() throws Exception {
    when(postCommandService.create(any(CreatePostRequest.class), any()))
        .thenThrow(new IllegalArgumentException("Invalid visibility"));

    final MockMultipartFile requestPart = new MockMultipartFile(
        "request",
        "",
        MediaType.APPLICATION_JSON_VALUE,
        """
        {"title":"test","actionText":"do action","visibility":"INVALID"}
        """.getBytes(StandardCharsets.UTF_8)
    );

    mockMvc.perform(multipart("/api/posts").file(requestPart))
        .andExpect(status().isBadRequest());
  }

  @Test
  void getPostById_returns200_whenFound() throws Exception {
    final UUID postId = UUID.randomUUID();
    final PostResponse response = new PostResponse(
        postId,
        UUID.fromString("00000000-0000-0000-0000-000000000001"),
        "title",
        "action",
        null,
        null,
        "PUBLIC",
        OffsetDateTime.now(),
        List.of()
    );
    when(postQueryService.findById(eq(postId))).thenReturn(response);

    mockMvc.perform(get("/api/posts/{id}", postId))
        .andExpect(status().isOk());
  }

  @Test
  void searchPosts_returns200() throws Exception {
    final Page<PostSummaryResponse> page = new PageImpl<>(
        List.of(
            new PostSummaryResponse(
                UUID.randomUUID(),
                UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "title",
                "preview",
                "PUBLIC",
                OffsetDateTime.now(),
                null
            )
        )
    );
    when(postQueryService.search(any(SearchPostsRequest.class))).thenReturn(page);

    mockMvc.perform(get("/api/posts")
            .param("visibility", "PUBLIC")
            .param("page", "0")
            .param("size", "20"))
        .andExpect(status().isOk());
  }
}
