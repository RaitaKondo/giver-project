package com.giver.backend.user.dto;

import java.util.UUID;

public record FollowUserResponse(
    UUID id,
    String displayName,
    String email,
    String photoUrl,
    boolean following
) {
}
