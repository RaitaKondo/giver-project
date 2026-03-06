package com.giver.backend.post.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PostSummaryResponse(
    UUID id,
    UUID authorId,
    String title,
    String actionTextPreview,
    String visibility,
    OffsetDateTime createdAt,
    String thumbnailUrl
) {
}
