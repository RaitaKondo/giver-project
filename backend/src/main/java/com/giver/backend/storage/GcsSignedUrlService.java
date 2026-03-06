package com.giver.backend.storage;

import com.google.cloud.storage.BlobInfo;
import java.net.URL;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

import com.google.cloud.storage.Storage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GcsSignedUrlService {

  private final Storage storage;
  private final String bucket;
  private final long durationMinutes;

  public GcsSignedUrlService(
      Storage storage,
      @Value("${app.gcs.bucket}") String bucket,
      @Value("${app.gcs.signed-url-duration-minutes}") long durationMinutes
  ) {
    this.storage = Objects.requireNonNull(storage);
    this.bucket = Objects.requireNonNull(bucket);
    this.durationMinutes = durationMinutes;
  }

  public String createGetSignedUrl(String objectName) {
    final BlobInfo blobInfo = BlobInfo.newBuilder(bucket, objectName).build();

    final URL url = storage.signUrl(
        blobInfo,
        durationMinutes,
        TimeUnit.MINUTES,
        Storage.SignUrlOption.withV4Signature()
    );

    return url.toString();
  }
}