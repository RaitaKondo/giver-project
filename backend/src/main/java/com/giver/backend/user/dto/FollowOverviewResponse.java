package com.giver.backend.user.dto;

import java.util.List;

public record FollowOverviewResponse(
    long followingCount,
    long followerCount,
    List<FollowUserResponse> followingUsers,
    List<FollowUserResponse> followerUsers
) {
}
