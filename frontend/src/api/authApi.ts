import { apiDelete, apiGet, apiPatchJson, apiPost } from "./apiClient";
import type { PageResponse, PostSummaryResponse } from "./postApi";

export type UserProfileResponse = {
  id: string;
  displayName: string;
  email: string | null;
  photoUrl: string | null;
  createdAt: string;
  following: boolean;
};

export type UpdateProfileRequest = {
  displayName: string;
  email: string | null;
  photoUrl: string | null;
};

export type FollowUserResponse = {
  id: string;
  displayName: string;
  email: string | null;
  photoUrl: string | null;
  following: boolean;
};

export type FollowOverviewResponse = {
  followingCount: number;
  followerCount: number;
  followingUsers: FollowUserResponse[];
  followerUsers: FollowUserResponse[];
};

export const fetchCurrentUser = async (): Promise<UserProfileResponse> => {
  return apiGet<UserProfileResponse>("/api/auth/me");
};

export const fetchMyProfile = async (): Promise<UserProfileResponse> => {
  return apiGet<UserProfileResponse>("/api/me/profile");
};

export const updateMyProfile = async (
  request: UpdateProfileRequest,
): Promise<UserProfileResponse> => {
  return apiPatchJson<UserProfileResponse>("/api/me/profile", request);
};

export const fetchMyPosts = async (
  page = 0,
  size = 20,
): Promise<PageResponse<PostSummaryResponse>> => {
  return apiGet<PageResponse<PostSummaryResponse>>(`/api/me/posts?page=${page}&size=${size}`);
};

export const fetchMyFollows = async (): Promise<FollowOverviewResponse> => {
  return apiGet<FollowOverviewResponse>("/api/me/follows");
};

export const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  return apiGet<UserProfileResponse>(`/api/users/${userId}`);
};

export const fetchUserPosts = async (
  userId: string,
  page = 0,
  size = 20,
): Promise<PageResponse<PostSummaryResponse>> => {
  return apiGet<PageResponse<PostSummaryResponse>>(`/api/users/${userId}/posts?page=${page}&size=${size}`);
};

export const followUser = async (userId: string): Promise<void> => {
  await apiPost(`/api/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await apiDelete(`/api/users/${userId}/follow`);
};

export const bookmarkPost = async (postId: string): Promise<void> => {
  await apiPost(`/api/posts/${postId}/bookmark`);
};

export const removeBookmark = async (postId: string): Promise<void> => {
  await apiDelete(`/api/posts/${postId}/bookmark`);
};
