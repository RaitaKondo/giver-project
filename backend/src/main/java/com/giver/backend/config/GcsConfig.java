package com.giver.backend.config;

import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GcsConfig {

  @Bean
  public Storage storage() {
    // GCS クライアントを Spring Bean 化して、各 Storage Service へ DI する。
    // 認証情報は ADC(Application Default Credentials) を利用する前提。
    return StorageOptions.getDefaultInstance().getService();
  }
}
