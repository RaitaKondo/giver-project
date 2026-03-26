const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";
const defaultAuthorId =
  (import.meta.env.VITE_DEFAULT_AUTHOR_ID as string | undefined)?.trim() ??
  "00000000-0000-0000-0000-000000000001";

// 環境変数を1箇所に集約して参照ミスを減らす
export const env = {
  apiBaseUrl,
  defaultAuthorId,
} as const;
