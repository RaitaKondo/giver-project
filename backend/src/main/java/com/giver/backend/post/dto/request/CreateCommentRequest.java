package com.giver.backend.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCommentRequest(
    @NotBlank(message = "body is required.")
    @Size(max = 300, message = "body must be <= 300 characters.")
    String body
) {
}
