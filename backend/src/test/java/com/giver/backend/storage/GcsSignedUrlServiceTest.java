package com.giver.backend.storage;

import static org.assertj.core.api.Assertions.assertThat;

import com.google.cloud.storage.Storage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GcsSignedUrlServiceTest {

  @Mock
  private Storage storage;

  @Test
  void createGetSignedUrl_returnsPlaceholderWhenBucketIsBlank() {
    final GcsSignedUrlService service = new GcsSignedUrlService(storage, "", "", 15);

    final String signedUrl = service.createGetSignedUrl("posts/p-1/image.png");

    assertThat(signedUrl).startsWith("https://placehold.co/");
  }

  @Test
  void createGetSignedUrl_returnsPublicBaseUrlWhenConfigured() {
    final GcsSignedUrlService service = new GcsSignedUrlService(
        storage,
        "",
        "https://cdn.example.com/assets",
        15
    );

    final String signedUrl = service.createGetSignedUrl("posts/p-1/image.png");

    assertThat(signedUrl).isEqualTo("https://cdn.example.com/assets/posts/p-1/image.png");
  }
}
