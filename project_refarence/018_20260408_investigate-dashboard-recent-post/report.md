# report

## 作業概要
ダッシュボード「総投稿数」欄の recent post（`◯件 / 30日`）が機能しない原因を調査した。

## 実施結果
- 原因は日付型の不整合。
- `DashboardPage` では `fetchMyPosts` の結果を `toFeedPost` で変換して `myPosts` に格納している。
- `toFeedPost` は `createdAt` を `formatCreatedAt` で表示用文字列（例: `2026年4月8日`）に変換する。
- 一方で recent post 集計 `isInLastDays(post.createdAt, 30)` は `new Date(value)` で日時比較を行う。
- 表示用文字列は `new Date(...)` で正しく解釈できず `Invalid Date` になり、`isInLastDays` が `false` を返し続けるため、recent post が正しくカウントされない。

## 変更ファイル一覧
- `project_refarence/018_20260408_investigate-dashboard-recent-post/input_prompt.md`
- `project_refarence/018_20260408_investigate-dashboard-recent-post/report.md`

## 主要な判断理由
- 集計ロジックは比較に生データ日時（ISO）を使うべきだが、現状は表示用フォーマット済み文字列を使っているため。

## 調査内容と結論
調査:
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/features/posts/postMappers.ts`

結論:
- 表示用フォーマットと集計用日付を同じフィールドで兼用したことが不具合原因。

## 未完了事項
- 実装修正は未実施（ユーザー指示により）。

## 次のアクション候補
1. 集計には API の `createdAt`（ISO）を使い、表示時だけ `formatCreatedAt` を適用する
2. あるいは `Post` 型に `createdAtRaw` を追加して集計は raw を参照する

## 検証方法または確認手順
- `DashboardPage` で `isInLastDays` に渡る値が `YYYY-MM-DD...` ではなく `2026年4月8日` になっていることを確認
- `new Date("2026年4月8日")` が環境依存で `Invalid Date` になりうることを確認
