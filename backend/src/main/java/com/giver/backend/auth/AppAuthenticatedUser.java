package com.giver.backend.auth;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public record AppAuthenticatedUser(
    UUID userId,
    String firebaseUid,
    String displayName,
    String email,
    String photoUrl
) {

  public Collection<? extends GrantedAuthority> authorities() {
    return List.of(new SimpleGrantedAuthority("ROLE_USER"));
  }
}
