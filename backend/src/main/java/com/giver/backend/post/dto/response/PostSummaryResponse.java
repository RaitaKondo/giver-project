package com.giver.backend.post.dto.response;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.giver.backend.context.dto.PostContextResponse;

public record PostSummaryResponse(
    UUID id,
    UUID authorId,
    String title,
    String actionTextPreview,
    String visibility,
    OffsetDateTime createdAt,
    String thumbnailUrl,
    List<PostContextResponse> contexts
) {
}
