import { env } from "../config/env";
import { firebaseAuth } from "../lib/firebase";

type ApiErrorBody = {
  message?: string;
};

function buildUrl(path: string): string {
  const base = env.apiBaseUrl;
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL が未設定です。frontend/.env.local に API のURLを設定してください。",
    );
  }

  return `${base}${path}`;
}

async function buildAuthHeaders(initHeaders?: HeadersInit): Promise<Headers> {
  const headers = new Headers(initHeaders);
  const idToken = await firebaseAuth.currentUser?.getIdToken();
  if (idToken) {
    headers.set("Authorization", `Bearer ${idToken}`);
  }
  return headers;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    method: "GET",
    credentials: "include",
    headers: await buildAuthHeaders(init?.headers),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(body?.message ?? "API リクエストに失敗しました。");
  }

  return response.json() as Promise<T>;
}

export async function apiPost(path: string, init?: RequestInit): Promise<void> {
  const response = await fetch(buildUrl(path), {
    ...init,
    method: "POST",
    headers: await buildAuthHeaders(init?.headers),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(errorBody?.message ?? "API リクエストに失敗しました。");
  }
}

export async function apiPostFormData<T>(
  path: string,
  body: FormData,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    ...init,
    method: "POST",
    body,
    headers: await buildAuthHeaders(init?.headers),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(errorBody?.message ?? "API リクエストに失敗しました。");
  }

  return response.json() as Promise<T>;
}

export async function apiPatchJson<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const headers = await buildAuthHeaders(init?.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(buildUrl(path), {
    ...init,
    method: "PATCH",
    body: JSON.stringify(body),
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(errorBody?.message ?? "API リクエストに失敗しました。");
  }

  return response.json() as Promise<T>;
}

export async function apiDelete(path: string, init?: RequestInit): Promise<void> {
  const response = await fetch(buildUrl(path), {
    ...init,
    method: "DELETE",
    headers: await buildAuthHeaders(init?.headers),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(errorBody?.message ?? "API リクエストに失敗しました。");
  }
}
