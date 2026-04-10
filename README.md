# giver-project

---

# 🚀 giver-project 技術アピールポイント

## 🎯 一言まとめ

Firebase Authentication を使ったログイン付きのソーシャル投稿アプリです。  
`frontend/` は React + Vite、`backend/` は Spring Boot + PostgreSQL で構成しています。

GCP上でクラウドネイティブな構成を採用し、  
認証・インフラ・ストレージを分離しながら、  
コスト最適化や運用まで考慮した設計を行ったプロジェクトです。

---

## 🌳 概要

本プロジェクトは、GCP上でクラウドネイティブな構成を採用し、  
認証・インフラ・ストレージを分離しながら、  
**運用・コスト最適化まで考慮した設計**を行っています。

---

## ☁️ クラウド・インフラ設計

### 🏗 システムフロー

Frontend (React + Firebase Auth)
→ Firebase Authentication
→ (ID Token)
→ Backend (Cloud Run / Spring Boot)
→ Cloud SQL (PostgreSQL)
→ Cloud Storage (GCS)

---

## 🚀 デプロイメントフロー

Source Code
→ Docker Build
→ Artifact Registry
→ Cloud Run (API)
→ Cloud SQL / GCS

---

## 🔐 リクエストフロー

User
→ Frontend (React)
→ Firebase Auth (Login)
→ ID Token
→ Cloud Run (Spring Boot)
→ Firebase Admin SDK (Token Verify)
→ Application Logic
→ Cloud SQL / GCS

---

## 💰 コスト最適化フロー（スケジューラでDBインスタンスを管理）

Cloud Scheduler
→ Cloud Function / Job
→ Cloud SQL Admin API
→ Cloud SQL (Start / Stop)

---

## 🌐 全体像

[User]
→ [React Frontend]
→ [Firebase Auth]
→ (ID Token)
→ [Cloud Run (Spring Boot API)]
→ [Cloud SQL] / [Cloud Storage]

- Background Job:
  [Cloud Scheduler] → [SQL Stop/Start]

Deployment:
Source → Docker → Artifact Registry → Cloud Run

### クラウドネイティブ構成

- Cloud Run を中心としたサーバーレスアーキテクチャ
- スケーリング・可用性をクラウドに委譲
- ステートレスなAPI設計

---

### コスト最適化

- Cloud SQL の自動停止（Cloud Scheduler + API制御）
- 環境ごとのコスト戦略（prod / stg / dev 分離）
- リソース使用率に基づくスペック最適化

---

### セキュリティ設計

- Secret Manager による機密情報管理
- Firebase Authentication による認証
- Backend側でのIDトークン検証

---

### 環境分離

- staging / production の完全分離
- DBユーザー・権限の分離（app / migrate）
- 環境変数による設定管理

---

## ☕ バックエンド設計（Java / Spring Boot）

### コンテナ前提設計

- Spring Boot アプリを Docker イメージとしてビルド
- 実行環境の差異を排除（ローカル / 本番の統一）

---

### 責務分離

- Controller / Service / Repository のレイヤー分離
- DTOによる境界の明確化
- バリデーションロジックをService層へ委譲

---

### DB設計

- Flyway によるマイグレーション管理
- Hibernateは `validate` に固定（本番でDDL禁止）
- 外部キー・正規化を意識した設計

---

### ストレージ設計

- 画像は GCS に保存
- DBには object_name のみ保持
- 署名付きURLで安全に配信

---

## 🔐 認証・アーキテクチャ

### 認証分離

- 認証：Firebase Authentication
- 認可・業務ロジック：Spring Boot

---

## Firebase Auth

- 認証方式: メール / パスワード
- フロントは Firebase Auth でサインイン
- API 呼び出し時は Firebase ID トークンを `Authorization: Bearer <token>` で送信
- バックエンドは Secret Manager から値を読み、Firebase Admin SDK でトークン検証

---

### トークンベース認証

- Bearer Token を用いたステートレス認証
- セッション管理を排除

---

### ユーザー同期

- Firebase UID をキーにDBユーザーを管理
- 初回ログイン時に自動生成

---

## ⚛️ フロントエンド設計

### モダン構成

- React + TypeScript + Vite
- 環境変数によるAPI切り替え

---

### API連携

- Firebase認証 → Backend検証のフロー
- セキュアなトークン連携

---

## 🚀 デプロイ・運用

### コンテナデプロイ

- Dockerビルド → Artifact Registry → Cloud Run
- 環境差異のないデプロイ

---

### 運用設計

- イメージベースの環境展開（stg / prod）
- ビルドと実行の分離

---

### ログ・トラブルシュート

- Cloud Runログによる障害解析
- DB接続・Flywayエラー対応経験

---

## 🧠 設計思想

- 責務分離を徹底したアーキテクチャ
- 開発だけでなく運用まで考慮した設計
