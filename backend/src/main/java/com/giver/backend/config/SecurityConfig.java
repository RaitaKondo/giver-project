package com.giver.backend.config;

import com.giver.backend.auth.FirebaseAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      FirebaseAuthenticationFilter firebaseAuthenticationFilter
  ) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .httpBasic(AbstractHttpConfigurer::disable)
        .formLogin(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/actuator/**", "/api/hello").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/posts", "/api/posts/*", "/api/context-masters").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/users/*", "/api/users/*/posts").permitAll()
            .requestMatchers("/api/auth/me", "/api/me/**").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/posts").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/users/*/follow").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/users/*/follow").authenticated()
            .requestMatchers(HttpMethod.POST, "/api/posts/*/bookmark").authenticated()
            .requestMatchers(HttpMethod.DELETE, "/api/posts/*/bookmark").authenticated()
            .anyRequest().permitAll()
        )
        .addFilterBefore(firebaseAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
