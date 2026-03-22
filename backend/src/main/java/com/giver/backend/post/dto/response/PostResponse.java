package com.giver.backend.post.dto.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PostResponse(
    UUID id,
    UUID authorId,
    String title,
    String actionText,
    String conflictText,
    String changeText,
    String visibility,
    OffsetDateTime createdAt,
    List<PostImageResponse> images
) {
}
