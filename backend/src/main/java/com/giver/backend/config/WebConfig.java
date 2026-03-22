package com.giver.backend.config;


import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${app.cors.allowed-origins:http://localhost:5173}")
  private String allowedOrigins;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    // "," または ";" で分割できるようにする（運用上の入力ブレに強い）
    String[] origins = Arrays.stream(allowedOrigins.split("[,;]"))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toArray(String[]::new);

    registry.addMapping("/api/**")
        .allowedOrigins(origins)
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
  }
}