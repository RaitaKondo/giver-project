package com.giver.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.firebase")
public record FirebaseAuthProperties(
    String projectId,
    String serviceAccountSecretName
) {
}
