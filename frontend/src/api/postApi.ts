import { apiGet, apiPostFormData } from "./apiClient";

export type Visibility = "PUBLIC" | "FOLLOWERS" | "PRIVATE";

export type ContextMasterResponse = {
  id: number;
  code: string;
  name: string;
  category: "RELATIONSHIP" | "PLACE" | "SITUATION" | string;
  sortOrder: number;
};

export type PostContextResponse = {
  id: number;
  code: string;
  name: string;
  category: string;
};

export type PostSummaryResponse = {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorPhotoUrl: string | null;
  title: string | null;
  actionTextPreview: string;
  changeText: string | null;
  visibility: Visibility;
  createdAt: string;
  thumbnailUrl: string | null;
  contexts: PostContextResponse[];
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};

export type CreatePostRequest = {
  title: string | null;
  actionText: string;
  conflictText: string | null;
  changeText: string | null;
  visibility: Visibility;
  contextIds: number[];
};

export type CreatePostResponse = {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorPhotoUrl: string | null;
  title: string | null;
  actionText: string;
  conflictText: string | null;
  changeText: string | null;
  visibility: Visibility;
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
  contexts: PostContextResponse[];
};

export type PostDetailResponse = {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorPhotoUrl: string | null;
  title: string | null;
  actionText: string;
  conflictText: string | null;
  changeText: string | null;
  visibility: Visibility;
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    sortOrder: number;
  }>;
  contexts: PostContextResponse[];
};

export const fetchPosts = async (
  visibility = "PUBLIC",
  page = 0,
  size = 10,
): Promise<PageResponse<PostSummaryResponse>> => {
  const query = new URLSearchParams({ visibility, page: String(page), size: String(size) });
  return apiGet<PageResponse<PostSummaryResponse>>(`/api/posts?${query.toString()}`);
};

export const fetchContextMasters = async (): Promise<ContextMasterResponse[]> => {
  return apiGet<ContextMasterResponse[]>("/api/context-masters");
};

export const fetchPostById = async (postId: string): Promise<PostDetailResponse> => {
  return apiGet<PostDetailResponse>(`/api/posts/${postId}`);
};

export const createPost = async (
  request: CreatePostRequest,
  images: File[],
): Promise<CreatePostResponse> => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(request));

  images.forEach((file) => {
    formData.append("images", file);
  });

  return apiPostFormData<CreatePostResponse>("/api/posts", formData);
};
