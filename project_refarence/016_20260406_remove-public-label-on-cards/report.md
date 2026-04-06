# report

## 作業概要
フィード・みつけるページの投稿カード右下に表示される「公開」ラベルを非表示にした。

## 実施結果
- `PostCard` に表示制御プロップ `showVisibility` を追加（デフォルト true）。
- `FeedPage` と `DiscoverPage` からは `showVisibility={false}` で表示を抑止。
- 他ページ（例: ProfilePage）は既存挙動を維持。

## 変更ファイル一覧
- `frontend/src/features/posts/PostCard.tsx`
- `frontend/src/pages/FeedPage.tsx`
- `frontend/src/pages/DiscoverPage.tsx`
- `project_refarence/016_20260406_remove-public-label-on-cards/input_prompt.md`
- `project_refarence/016_20260406_remove-public-label-on-cards/report.md`

## 主要な判断理由
- 共通コンポーネント全体で消すと他画面への影響が広いため、対象ページのみ非表示にする方針が安全なため。

## 調査内容と結論
調査:
- `PostCard` の公開ラベル描画箇所
- `FeedPage` / `DiscoverPage` のカード呼び出し

結論:
- props 制御で対象ページのみ非表示にするのが最小リスク。

## 未完了事項
- なし

## 次のアクション候補
1. 必要なら ProfilePage など他画面でも同様に非表示化

## 検証方法または確認手順
- `npm run build` 実行成功
- `/feed` と `/discover` の投稿カード右下に「公開」表示がないことを確認
