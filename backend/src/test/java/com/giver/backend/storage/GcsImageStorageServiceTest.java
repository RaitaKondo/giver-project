package com.giver.backend.storage;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.google.cloud.storage.Storage;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class GcsImageStorageServiceTest {

  @Mock
  private Storage storage;

  @Test
  void storePostImage_skipsUploadWhenBucketIsBlank() {
    final GcsImageStorageService service = new GcsImageStorageService(storage, "");

    final MockMultipartFile file = new MockMultipartFile(
        "images",
        "sample.png",
        "image/png",
        "dummy".getBytes(StandardCharsets.UTF_8)
    );

    final GcsImageStorageService.StoredObject stored = service.storePostImage(UUID.randomUUID(), file);

    assertThat(stored.bucket()).isBlank();
    assertThat(stored.objectName()).startsWith("posts/");
    verify(storage, never()).create(any(), any(byte[].class));
  }
}
