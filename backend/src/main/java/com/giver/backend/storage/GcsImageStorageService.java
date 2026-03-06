package com.giver.backend.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GcsImageStorageService {

  private final Storage storage;
  private final String bucket;

  public GcsImageStorageService(
      Storage storage,
      @Value("${app.gcs.bucket}") String bucket
  ) {
    this.storage = Objects.requireNonNull(storage);
    this.bucket = Objects.requireNonNull(bucket);
  }

  public StoredObject storePostImage(UUID postId, MultipartFile file) {
    try {
      final String objectName = buildObjectName(postId, file.getOriginalFilename());
      final BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucket, objectName))
          .setContentType(file.getContentType())
          .build();

      storage.create(blobInfo, file.getBytes());

      return new StoredObject(bucket, objectName, file.getContentType());
    } catch (IOException e) {
      throw new IllegalStateException("Failed to upload image to GCS.", e);
    }
  }

  private String buildObjectName(UUID postId, String originalFilename) {
    final String extension = extractExtension(originalFilename);
    return "posts/%s/%s%s".formatted(postId, UUID.randomUUID(), extension);
  }

  private String extractExtension(String filename) {
    if (filename == null || !filename.contains(".")) {
      return "";
    }
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
  }

  public record StoredObject(String bucket, String objectName, String contentType) {}
}