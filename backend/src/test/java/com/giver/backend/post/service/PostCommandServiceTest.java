package com.giver.backend.post.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import com.giver.backend.auth.CurrentUserService;
import com.giver.backend.context.entity.ContextMaster;
import com.giver.backend.context.repository.ContextMasterRepository;
import com.giver.backend.post.dto.request.CreatePostRequest;
import com.giver.backend.post.dto.response.PostResponse;
import com.giver.backend.post.entity.Post;
import com.giver.backend.post.repository.PostRepository;
import com.giver.backend.storage.GcsImageStorageService;
import com.giver.backend.storage.GcsSignedUrlService;
import java.util.LinkedHashSet;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PostCommandServiceTest {

  private static final java.util.UUID CURRENT_USER_ID =
      java.util.UUID.fromString("00000000-0000-0000-0000-000000000001");

  @Mock
  private PostRepository postRepository;

  @Mock
  private ContextMasterRepository contextMasterRepository;

  @Mock
  private GcsImageStorageService gcsImageStorageService;

  @Mock
  private GcsSignedUrlService gcsSignedUrlService;

  @Mock
  private CurrentUserService currentUserService;

  private PostCommandService postCommandService;

  @BeforeEach
  void setUp() {
    postCommandService = new PostCommandService(
        postRepository,
        contextMasterRepository,
        gcsImageStorageService,
        gcsSignedUrlService,
        currentUserService
    );

    when(postRepository.save(any(Post.class))).thenAnswer(invocation -> invocation.getArgument(0));
    lenient().when(currentUserService.requireCurrentUserId()).thenReturn(CURRENT_USER_ID);
  }

  @Test
  void create_savesValidContexts() {
    final CreatePostRequest request = new CreatePostRequest(
        "title",
        "action",
        "conflict",
        "change",
        "PUBLIC",
        List.of(1L, 3L, 5L)
    );

    final ContextMaster workplace = contextMaster(1L, "workplace", "職場", "PLACE", 10);
    final ContextMaster relatives = contextMaster(3L, "relatives", "親戚", "RELATIONSHIP", 30);
    final ContextMaster school = contextMaster(5L, "school", "学校", "PLACE", 50);

    when(contextMasterRepository.findByIdInAndIsActiveTrue(new LinkedHashSet<>(List.of(1L, 3L, 5L)))).thenReturn(List.of(
        workplace,
        relatives,
        school
    ));

    final PostResponse response = postCommandService.create(request, null);

    assertThat(response.contexts()).hasSize(3);
    assertThat(response.contexts()).extracting("code")
        .containsExactly("workplace", "relatives", "school");
  }

  @Test
  void create_throwsWhenAnyContextIdIsInvalid() {
    final CreatePostRequest request = new CreatePostRequest(
        "title",
        "action",
        null,
        null,
        "PUBLIC",
        List.of(1L, 999L)
    );

    when(contextMasterRepository.findByIdInAndIsActiveTrue(new LinkedHashSet<>(List.of(1L, 999L)))).thenReturn(List.of(
        contextMaster(1L, "workplace", "職場", "PLACE", 10)
    ));

    assertThatThrownBy(() -> postCommandService.create(request, null))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("contextIds contains invalid or inactive context master id.");
  }

  @Test
  void create_deduplicatesContextIdsBeforeSave() {
    final CreatePostRequest request = new CreatePostRequest(
        "title",
        "action",
        null,
        null,
        "PUBLIC",
        List.of(1L, 1L, 3L, 3L)
    );

    final ContextMaster workplace = contextMaster(1L, "workplace", "職場", "PLACE", 10);
    final ContextMaster relatives = contextMaster(3L, "relatives", "親戚", "RELATIONSHIP", 30);

    when(contextMasterRepository.findByIdInAndIsActiveTrue(new LinkedHashSet<>(List.of(1L, 3L)))).thenReturn(
        List.of(workplace, relatives)
    );

    final PostResponse response = postCommandService.create(request, null);

    assertThat(response.contexts()).hasSize(2);
    assertThat(response.contexts()).extracting("id").containsExactly(1L, 3L);
  }

  private ContextMaster contextMaster(Long id, String code, String name, String category, int sortOrder) {
    final ContextMaster contextMaster = new ContextMaster(code, name, category, sortOrder, true);
    try {
      final java.lang.reflect.Field idField = ContextMaster.class.getDeclaredField("id");
      idField.setAccessible(true);
      idField.set(contextMaster, id);
      return contextMaster;
    } catch (ReflectiveOperationException ex) {
      throw new IllegalStateException(ex);
    }
  }
}
