package com.giver.backend.user.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserProfileResponse(
    UUID id,
    String displayName,
    String email,
    String photoUrl,
    OffsetDateTime createdAt,
    boolean following
) {
}
