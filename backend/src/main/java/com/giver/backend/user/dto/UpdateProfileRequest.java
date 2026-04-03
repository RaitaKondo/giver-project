package com.giver.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank(message = "displayName is required.")
    @Size(max = 100, message = "displayName must be <= 100 characters.")
    String displayName,
    @Email(message = "email must be a valid email address.")
    @Size(max = 255, message = "email must be <= 255 characters.")
    String email,
    @Size(max = 1000, message = "photoUrl must be <= 1000 characters.")
    String photoUrl
) {
}
