const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? "";
const firebaseApiKey = (import.meta.env.VITE_FIREBASE_API_KEY as string | undefined)?.trim() ?? "";
const firebaseAuthDomain =
  (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined)?.trim() ?? "";
const firebaseProjectId =
  (import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined)?.trim() ?? "";
const firebaseStorageBucket =
  (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined)?.trim() ?? "";
const firebaseMessagingSenderId =
  (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined)?.trim() ?? "";
const firebaseAppId = (import.meta.env.VITE_FIREBASE_APP_ID as string | undefined)?.trim() ?? "";
const firebaseMeasurementId =
  (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined)?.trim() ?? "";

// 環境変数を1箇所に集約して参照ミスを減らす
export const env = {
  apiBaseUrl,
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId,
} as const;
