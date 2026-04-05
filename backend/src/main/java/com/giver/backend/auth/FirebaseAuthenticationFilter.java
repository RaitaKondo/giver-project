package com.giver.backend.auth;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.giver.backend.user.service.UserAccountService;
import com.giver.backend.user.service.UserAccountService.UpsertUserCommand;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

  private final FirebaseAuth firebaseAuth;
  private final UserAccountService userAccountService;

  public FirebaseAuthenticationFilter(
      FirebaseAuth firebaseAuth,
      UserAccountService userAccountService
  ) {
    this.firebaseAuth = firebaseAuth;
    this.userAccountService = userAccountService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    final String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      final String idToken = header.substring("Bearer ".length()).trim();
      final FirebaseToken firebaseToken = firebaseAuth.verifyIdToken(idToken);
      final var user = userAccountService.upsertFromFirebase(new UpsertUserCommand(
          firebaseToken.getUid(),
          resolveDisplayName(firebaseToken),
          firebaseToken.getEmail(),
          firebaseToken.getPicture()
      ));

      final AppAuthenticatedUser principal = new AppAuthenticatedUser(
          user.getId(),
          user.getFirebaseUid(),
          user.getDisplayName(),
          user.getEmail(),
          user.getPhotoUrl()
      );

      SecurityContextHolder.getContext().setAuthentication(
          new UsernamePasswordAuthenticationToken(principal, idToken, principal.authorities())
      );
      filterChain.doFilter(request, response);
    } catch (FirebaseAuthException ex) {
      SecurityContextHolder.clearContext();
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"message\":\"Firebase ID token is invalid or expired.\",\"details\":[]}");
    }
  }

  private String resolveDisplayName(FirebaseToken firebaseToken) {
    if (StringUtils.hasText(firebaseToken.getName())) {
      return firebaseToken.getName().trim();
    }
    if (StringUtils.hasText(firebaseToken.getEmail())) {
      return firebaseToken.getEmail().split("@")[0];
    }
    return firebaseToken.getUid();
  }
}
