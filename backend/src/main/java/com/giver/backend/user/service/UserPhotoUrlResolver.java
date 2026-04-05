package com.giver.backend.user.service;

import com.giver.backend.storage.GcsSignedUrlService;
import com.giver.backend.user.entity.UserAccount;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class UserPhotoUrlResolver {

  private final GcsSignedUrlService gcsSignedUrlService;

  public UserPhotoUrlResolver(GcsSignedUrlService gcsSignedUrlService) {
    this.gcsSignedUrlService = gcsSignedUrlService;
  }

  public String resolve(UserAccount user) {
    if (StringUtils.hasText(user.getProfilePhotoObjectName())) {
      return gcsSignedUrlService.createGetSignedUrl(user.getProfilePhotoObjectName());
    }
    return StringUtils.hasText(user.getPhotoUrl()) ? user.getPhotoUrl().trim() : null;
  }
}
