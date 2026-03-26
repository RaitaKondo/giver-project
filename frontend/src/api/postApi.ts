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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPosts = async (): Promise<PageResponse<PostSummaryResponse>> => {
  const url = `${API_BASE_URL}/api/posts?visibility=PUBLIC&page=0&size=10`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const fetchContextMasters = async (): Promise<ContextMasterResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/api/context-masters`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("文脈マスターの取得に失敗しました。");
  }

  return response.json();
};

export const fetchPostById = async (postId: string): Promise<PostDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 404) {
    throw new Error("投稿が見つかりませんでした。");
  }

  if (!response.ok) {
    throw new Error("投稿詳細の取得に失敗しました。");
  }

  return response.json();
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

  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "投稿の公開に失敗しました。");
  }

  return response.json();
};
