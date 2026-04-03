package com.giver.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.secretmanager.v1.AccessSecretVersionRequest;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@EnableConfigurationProperties(FirebaseAuthProperties.class)
public class FirebaseAdminConfig {

  @Bean
  public FirebaseAuth firebaseAuth(FirebaseAuthProperties properties) throws IOException {
    final String projectId = requireValue(properties.projectId(), "app.firebase.project-id");
    final String secretName = requireValue(
        properties.serviceAccountSecretName(),
        "app.firebase.service-account-secret-name"
    );
    final String secretPath = "projects/%s/secrets/%s/versions/latest".formatted(projectId, secretName);

    try (SecretManagerServiceClient secretManagerClient = SecretManagerServiceClient.create()) {
      final String json = secretManagerClient.accessSecretVersion(
          AccessSecretVersionRequest.newBuilder().setName(secretPath).build()
      ).getPayload().getData().toStringUtf8();

      final GoogleCredentials credentials = GoogleCredentials.fromStream(
          new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))
      );
      final FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(credentials)
          .setProjectId(projectId)
          .build();

      final FirebaseApp firebaseApp = FirebaseApp.getApps().stream()
          .filter(app -> app.getName().equals(FirebaseApp.DEFAULT_APP_NAME))
          .findFirst()
          .orElseGet(() -> FirebaseApp.initializeApp(options));

      return FirebaseAuth.getInstance(firebaseApp);
    }
  }

  private String requireValue(String value, String key) {
    if (!StringUtils.hasText(value)) {
      throw new IllegalStateException(key + " must be configured.");
    }
    return value.trim();
  }
}
