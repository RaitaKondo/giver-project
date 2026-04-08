package com.giver.backend.post.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CommentResponse(
    UUID id,
    UUID postId,
    UUID userId,
    String userDisplayName,
    String userPhotoUrl,
    String body,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    boolean edited
) {
}
