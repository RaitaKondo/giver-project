# input_prompt

## ユーザー依頼の原文
# 目的
Spring Boot（Java）バックエンドにコメント機能・リアクション機能を追加する。

既存:
- posts テーブルあり
- reactions テーブルあり（UNIQUE(post_id, user_id, type)）
- Spring Boot + JPA + PostgreSQL

---

# 1. 前提仕様

## コメント
- 機能: 有効
- 対象: PUBLIC投稿のみ
- 最大文字数: 300
- 改行: 許可
- URL: 禁止
- 編集: 可能
- 編集制限: なし（時間制限なし）
- 編集済み表示: する
- 削除権限:
  - コメント本人
  - 投稿者
  - 管理者
- 削除方式: ソフトデリート（deleted_at）
- 返信機能: なし
- 並び順: 古い順

## リアクション
- 機能: 有効
- 対象: PUBLIC投稿のみ
- 種類:
  - like
  - thanks
  - empathize
  - inspiring
- 1ユーザー:
  - 1投稿につき1種類のみ
- 再押下:
  - 同じtype → 解除
- 別type押下:
  - 既存削除して新規追加（置換）

## 表示
- APIレスポンスには以下を含める:
  - リアクション種類別件数（DB的には type ごとの count）
  - 自分のリアクション（1種）
  - コメント件数

---

# 2. DB設計

## comments テーブルを新規作成

```sql
comments (
  id UUID PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

回答は上記とする。わからないところが合ったら聞いて。なければ実装して

## この作業で扱う対象
- コメント機能とリアクション機能のバックエンド実装
- DBマイグレーション、API、サービス、リポジトリ、DTO、テスト

## 前提条件
- 既存 Spring Boot/JPA/PostgreSQL 構成
- reactions テーブルは既存

## 制約事項
- 指定仕様に従う
- 不明点がなければ実装する

## 実施前の整理メモ
- 管理者判定は現行セキュリティ実装に合わせる（ROLE_ADMIN 権限確認を優先）
- 投稿レスポンスへ reaction summary / myReaction / commentCount を追加する

## 実施方針
1. comments テーブル追加マイグレーション
2. Comment/Reaction の entity/repository/service/controller 実装
3. Postレスポンスへ集計情報追加
4. テスト追加・更新
5. ビルド/テスト確認
