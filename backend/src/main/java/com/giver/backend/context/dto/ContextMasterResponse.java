package com.giver.backend.context.dto;

public record ContextMasterResponse(
    Long id,
    String code,
    String name,
    String category,
    int sortOrder
) {
}
