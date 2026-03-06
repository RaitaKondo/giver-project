package com.giver.backend.post.dto.response;

import java.util.UUID;

public record PostImageResponse(
    UUID id,
    String url,
    int sortOrder
) {
}
