package com.giver.backend.post.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ToggleReactionRequest(
    @NotBlank(message = "type is required.")
    String type
) {
}
