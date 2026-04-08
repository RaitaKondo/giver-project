# report

## 作業概要
投稿へのコメント機能・リアクション機能を追加するために必要な要素を、現行実装を踏まえて整理した。

## 実施結果
- 既存DBには `reactions` テーブルが存在（将来用コメントあり）し、現時点では未使用。
- `comments` テーブルは未存在のため新規作成が必要。
- コメント/リアクションのために必要な項目を、仕様・API・DB・UI・運用・テストで整理。

## 変更ファイル一覧
- `project_refarence/020_20260408_comment-reaction-requirements/input_prompt.md`
- `project_refarence/020_20260408_comment-reaction-requirements/report.md`

## 主要な判断理由
- 既存アーキテクチャ（Bookmark/Follow の構成）を流用すると一貫性高く実装できるため。

## 調査内容と結論
調査:
- `backend/src/main/resources/db/migration/V1__init.sql`
- `frontend/src/pages/PostDetailPage.tsx`
- `backend/src/main/java/com/giver/backend/user/service/BookmarkService.java` ほか

結論:
- リアクションは既存テーブル活用で比較的短期導入可能。
- コメントはDB/API/UIすべて新規追加が必要。

## 未完了事項
- 実装未着手（今回は要件整理のみ）。

## 次のアクション候補
1. コメント仕様（編集可否・削除権限・返信有無）を確定
2. リアクション種別（いいねのみか複数種別か）を確定
3. API設計確定後に段階実装

## 検証方法または確認手順
- 実装後にAPIテスト、UI操作テスト、権限テストを実施
