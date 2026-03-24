package com.giver.backend.post.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
    @Size(max = 200) String title,
    @NotBlank @Size(max = 1000) String actionText,
    @Size(max = 1000) String conflictText,
    @Size(max = 1000) String changeText,
    @Size(max = 30) String visibility,
    List<@NotNull(message = "contextIds must not contain null.") Long> contextIds
) {
}
