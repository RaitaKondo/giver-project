package com.giver.backend.storage;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GcsStorageService {

  private final Storage storage;
  private final String bucket;
  private final String publicBase;

  public GcsStorageService(
      Storage storage,
      @Value("${app.gcs.bucket}") String bucket,
      @Value("${app.gcs.public-base}") String publicBase
  ) {
    this.storage = storage;
    this.bucket = bucket;
    this.publicBase = publicBase;
  }

  public StoredObject putPostImage(UUID postId, MultipartFile file) {
    try {
      // ファイル名衝突しないよう UUID
      String ext = guessExt(file.getOriginalFilename());
      String objectName = "posts/%s/%s%s".formatted(postId, UUID.randomUUID(), ext);

      BlobId blobId = BlobId.of(bucket, objectName);
      BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
          .setContentType(file.getContentType())
          .build();

      storage.create(blobInfo, file.getBytes());

      // 公開URL方式（MVP）：base + objectName
      String url = "%s/%s".formatted(publicBase, objectName);

      return new StoredObject(objectName, url);

    } catch (Exception e) {
      throw new RuntimeException("Failed to upload image to GCS", e);
    }
  }

  private static String guessExt(String filename) {
    if (filename == null) return "";
    String lower = filename.toLowerCase();
    if (lower.endsWith(".png")) return ".png";
    if (lower.endsWith(".webp")) return ".webp";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return ".jpg";
    return "";
  }

  public record StoredObject(String objectName, String publicUrl) {}
}