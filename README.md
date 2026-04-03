# giver-project

Firebase Authentication を使ったログイン付きのソーシャル投稿アプリです。  
`frontend/` は React + Vite、`backend/` は Spring Boot + PostgreSQL で構成しています。

## Directory

- `frontend/`: Web アプリ
- `backend/`: API / 認証検証 / DB アクセス
- `infra/`: インフラ用ファイル
- `project-reference/`: 実装メモと参照ドキュメント

## Frontend Env

`frontend/.env.development`

必要な値:

- `VITE_API_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Backend Env

必要な値:

- `DB_URL`
- `DB_USER`
- `DB_PASS`
- `CORS_ALLOWED_ORIGINS`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_SECRET_NAME`

## Firebase Auth

- 認証方式: メール / パスワード
- フロントは Firebase Auth でサインイン
- API 呼び出し時は Firebase ID トークンを `Authorization: Bearer <token>` で送信
- バックエンドは Secret Manager から `firebase-service-account` を読み、Firebase Admin SDK でトークン検証
- 初回ログイン時に `users` テーブルへ自動作成

保存するユーザー項目:

- `firebase_uid`
- `display_name`
- `email`
- `photo_url`

## Local Run

1. `frontend` で依存を入れる

```powershell
cd frontend
npm install
```

2. `backend` を起動する

```powershell
cd backend
./gradlew bootRun
```

3. `frontend` を起動する

```powershell
cd frontend
npm run dev
```

## Protected Features

ログイン必須:

- `/posts/new`
- `/me/dashboard`
- `/me/profile`
- 保存
- フォロー

公開:

- `/`
- `/feed`
- `/discover`
- `/posts/:id`
- `/users/:id`

## Notes

- ローカルでも Secret Manager 経由で Firebase Admin 用 secret を読む前提です。
- Cloud Run では `firebase-service-account` を Secret Manager から渡す構成を想定しています。
- バックエンド依存を初回解決するには、Gradle のネットワークアクセスが必要です。
