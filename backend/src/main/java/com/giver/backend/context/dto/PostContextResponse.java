package com.giver.backend.context.dto;

public record PostContextResponse(
    Long id,
    String code,
    String name,
    String category
) {
}
