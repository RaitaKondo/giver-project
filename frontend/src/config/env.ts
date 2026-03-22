// 環境変数を1箇所に集約して参照ミスを減らす
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
} as const;