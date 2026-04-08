package com.giver.backend.post.dto.response;

import java.util.Map;

public record ReactionSummaryResponse(
    Map<String, Long> reactionCounts,
    String myReactionType,
    long commentCount
) {
}
