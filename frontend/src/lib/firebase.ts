import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "../config/env";

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
  measurementId: env.firebaseMeasurementId || undefined,
};

function assertFirebaseConfig() {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([key]) => key !== "measurementId")
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase 設定が不足しています: ${missingKeys.join(", ")}。frontend/.env.* を確認してください。`,
    );
  }
}

assertFirebaseConfig();

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
