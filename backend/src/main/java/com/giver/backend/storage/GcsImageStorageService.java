package com.giver.backend.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;
import java.util.Locale;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GcsImageStorageService {

  private final Storage storage;
  private final String bucket;
  private final boolean gcsEnabled;

  public GcsImageStorageService(
      Storage storage,
      @Value("${app.gcs.bucket}") String bucket
  ) {
    // Storage Bean は通常必要だが、bucket 未設定のローカル開発では upload をスキップできるようにする。
    this.storage = Objects.requireNonNull(storage);
    this.bucket = bucket == null ? "" : bucket.trim();
    this.gcsEnabled = StringUtils.hasText(this.bucket);
  }

  public StoredObject storePostImage(UUID postId, MultipartFile file) {
    return storeImage("posts/%s".formatted(postId), file);
  }

  public StoredObject storeProfileImage(UUID userId, MultipartFile file) {
    return storeImage("users/%s/profile".formatted(userId), file);
  }

  private StoredObject storeImage(String prefix, MultipartFile file) {
    try {
      final String objectName = buildObjectName(prefix, file.getOriginalFilename());
      if (!gcsEnabled) {
        // GCS 未設定時は DB 参照用 objectName だけ発行し、画像アップロードは行わない。
        return new StoredObject("", objectName, file.getContentType());
      }

      final BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucket, objectName))
          .setContentType(file.getContentType())
          .build();

      storage.create(blobInfo, file.getBytes());

      return new StoredObject(bucket, objectName, file.getContentType());
    } catch (IOException e) {
      throw new IllegalStateException("Failed to upload image to GCS.", e);
    }
  }

  private String buildObjectName(String prefix, String originalFilename) {
    final String extension = extractExtension(originalFilename);
    return "%s/%s%s".formatted(prefix, UUID.randomUUID(), extension);
  }

  private String extractExtension(String filename) {
    if (filename == null || !filename.contains(".")) {
      return "";
    }
    return filename.substring(filename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
  }

  public record StoredObject(String bucket, String objectName, String contentType) {}
}
