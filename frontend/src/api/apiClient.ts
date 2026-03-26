import { env } from "../config/env";

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

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "GET",
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(body?.message ?? "API リクエストに失敗しました。");
  }

  return response.json() as Promise<T>;
}

export async function apiPostFormData<T>(
  path: string,
  body: FormData,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    body,
    ...init,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null as ApiErrorBody | null);
    throw new Error(errorBody?.message ?? "API リクエストに失敗しました。");
  }

  return response.json() as Promise<T>;
}
