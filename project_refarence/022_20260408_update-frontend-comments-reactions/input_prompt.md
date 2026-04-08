# input_prompt

## ユーザー依頼の原文
FEも同様にアップデートして

## この作業で扱う対象
- コメント/リアクション機能のフロントエンド実装
- バックエンド新レスポンス項目への型・画面対応

## 前提条件
- バックエンドにコメント/リアクションAPI追加済み
- 投稿レスポンスに reactionCounts/myReactionType/commentCount が追加済み

## 制約事項
- 既存画面を壊さない

## 実施前の整理メモ
- まず API 型定義と PostDetail 画面を更新する

## 実施方針
1. postApi 型/関数追加
2. PostDetailPage にコメント・リアクションUI追加
3. 必要な mapper/type更新
4. フロントビルド確認
