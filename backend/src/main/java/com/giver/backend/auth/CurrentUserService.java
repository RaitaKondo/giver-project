package com.giver.backend.auth;

import java.util.UUID;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

  public AppAuthenticatedUser requireCurrentUser() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null
        || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken
        || !(authentication.getPrincipal() instanceof AppAuthenticatedUser principal)) {
      throw new IllegalStateException("Authenticated user is required.");
    }
    return principal;
  }

  public UUID requireCurrentUserId() {
    return requireCurrentUser().userId();
  }

  public UUID getCurrentUserIdOrNull() {
    final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      return null;
    }
    if (authentication.getPrincipal() instanceof AppAuthenticatedUser principal) {
      return principal.userId();
    }
    return null;
  }
}
