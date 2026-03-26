package com.giver.backend.storage;

import com.google.cloud.storage.BlobInfo;
import java.net.URL;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class GcsSignedUrlService {

  private final Storage storage;
  private final String bucket;
  private final String publicBase;
  private final long durationMinutes;

  public GcsSignedUrlService(
      Storage storage,
      @Value("${app.gcs.bucket}") String bucket,
      @Value("${app.gcs.public-base:}") String publicBase,
      @Value("${app.gcs.signed-url-duration-minutes}") long durationMinutes
  ) {
    this.storage = Objects.requireNonNull(storage);
    this.bucket = bucket == null ? "" : bucket.trim();
    this.publicBase = publicBase == null ? "" : publicBase.trim();
    this.durationMinutes = durationMinutes;
  }

  public String createGetSignedUrl(String objectName) {
    if (!StringUtils.hasText(bucket)) {
      return toFallbackUrl(objectName);
    }

    try {
      final BlobInfo blobInfo = BlobInfo.newBuilder(bucket, objectName).build();
      final URL url = storage.signUrl(
          blobInfo,
          durationMinutes,
          TimeUnit.MINUTES,
          Storage.SignUrlOption.withV4Signature()
      );
      return url.toString();
    } catch (RuntimeException ex) {
      // ADC 未設定などで署名URLが作れない環境でも API が落ちないようにフォールバックする。
      return toFallbackUrl(objectName);
    }
  }

  private String toFallbackUrl(String objectName) {
    if (StringUtils.hasText(publicBase)) {
      final String normalizedBase = publicBase.endsWith("/")
          ? publicBase.substring(0, publicBase.length() - 1)
          : publicBase;
      final String normalizedObjectName = objectName.startsWith("/")
          ? objectName.substring(1)
          : objectName;
      return normalizedBase + "/" + normalizedObjectName;
    }
    return "https://placehold.co/1200x800?text=Image+preview+is+not+available+in+local+mode";
  }
}
