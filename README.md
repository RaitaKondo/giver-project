# Giver Project

善意の行動を記録・共有するためのモノレポです。  
フロントエンド（React + Vite）とバックエンド（Spring Boot + PostgreSQL）をローカルで起動して、投稿一覧・投稿詳細・投稿作成・文脈マスター取得までを一通り検証できます。

## 技術スタック

- Frontend: React 19, TypeScript, Vite, React Router, Tailwind CSS
- Backend: Spring Boot 4, Spring Web MVC, Spring Data JPA, Flyway, Bean Validation
- Database: PostgreSQL 16
- Image storage: Google Cloud Storage（未設定時はローカル向けフォールバック）

## ディレクトリ構成

- `frontend/`: SPA クライアント
- `backend/`: API サーバー
- `infra/`: インフラ関連の補助ファイル
- `project-reference/`: 仕様/作業用メモ
- `compose.yml`: API + DB のコンテナ起動定義

## セットアップ手順

1. Node.js 20+ と Java 21 をインストール
2. Docker Desktop を起動（DB をコンテナで使う場合）
3. 依存関係をインストール

```bash
cd frontend
npm install
cd ../backend
./gradlew --version
```

4. PostgreSQL を起動

```bash
docker compose up -d db
```

## 環境変数

### Frontend (`frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8080
# 任意: ダッシュボード/プロフィールで使う暫定ユーザーID
VITE_DEFAULT_AUTHOR_ID=00000000-0000-0000-0000-000000000001
```

### Backend

最小構成（GCSを使わないローカル開発）:

```env
DB_URL=jdbc:postgresql://localhost:15432/app
DB_USER=app
DB_PASS=app
CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_POST_DEFAULT_AUTHOR_ID=00000000-0000-0000-0000-000000000001
```

GCSを有効化する場合のみ追加:

```env
GCS_BUCKET=your-bucket
# 任意: 署名URLを使わない配信用ベースURL
GCS_PUBLIC_BASE=https://storage.googleapis.com/your-bucket
GCS_SIGNED_URL_DURATION_MINUTES=15
```

## ローカル起動手順

1. BE,DB起動

```bash
docker compose up --build
```

2. Frontend起動

```bash
cd frontend
npm run dev
```

3. ブラウザで確認

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8080/actuator/health`

## テスト手順

### Backend

```bash
cd backend
./gradlew test
```

### Frontend

```bash
cd frontend
npm run lint
npx tsc -b
```

`npm run build` は環境によって `esbuild` の `spawn EPERM` で失敗することがあります。  
その場合は権限制約のない端末で再実行してください。

## 現在の暫定仕様（認証導入前）

- 投稿の `authorId` は `APP_POST_DEFAULT_AUTHOR_ID` を使用
- ダッシュボード/プロフィールも暫定ユーザーIDを起点に表示
- フォロー/保存は UI プレースホルダーで、永続化 API は未接続

## 未実装事項と今後の課題

- Firebase Auth 連携と、認証ユーザーに紐づく投稿/プロフィール取得
- フォロー・保存・ダッシュボード集計の正式 API 実装
- ユーザープロフィール専用 API（表示名・自己紹介・参加日）
- 画像アップロードの本番運用設計（署名URL発行ポリシー、バケット公開戦略）
- E2E テスト導入（投稿作成から詳細表示まで）
- CI 上でのフロントビルド制約解消
