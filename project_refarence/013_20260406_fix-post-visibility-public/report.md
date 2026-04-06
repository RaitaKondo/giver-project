# report

## 作業概要
新規投稿の公開範囲を全て PUBLIC 固定に変更した。フロントの選択UIを廃止し、バックエンドでも入力値に関係なく PUBLIC で保存するよう統一した。

## 実施結果
- フロント投稿作成画面:
  - 公開範囲のラジオ選択UIを削除
  - 「公開（固定）」表示へ変更
  - API送信値の `visibility` を常に `"PUBLIC"` 固定化
- バックエンド投稿作成:
  - `visibility` 正規化ロジックを廃止し、常に `PUBLIC` を設定
- テスト更新:
  - `PostCommandServiceTest` に「PRIVATE指定でもPUBLICになる」テスト追加
  - `PostControllerTest` の visibility invalid ケースを PUBLIC固定仕様に合わせて 201 期待へ変更

## 変更ファイル一覧
- `frontend/src/pages/CreateRecordPage.tsx`
- `backend/src/main/java/com/giver/backend/post/service/PostCommandService.java`
- `backend/src/test/java/com/giver/backend/post/service/PostCommandServiceTest.java`
- `backend/src/test/java/com/giver/backend/post/controller/PostControllerTest.java`
- `project_refarence/013_20260406_fix-post-visibility-public/input_prompt.md`
- `project_refarence/013_20260406_fix-post-visibility-public/report.md`

## 主要な判断理由
- UIだけ変更するとAPI直叩きで回避されるため、バックエンドで最終的にPUBLIC固定する必要があるため。

## 調査内容と結論
調査:
- `CreateRecordPage.tsx` の visibility state/UI
- `PostCommandService#normalizeVisibility`

結論:
- フロント・バックエンド両方を固定化することで、すべての新規投稿をPUBLICに統一できる。

## 未完了事項
- 既存投稿データの visibility 変換は未実施（今回の変更は新規作成分に適用）。

## 次のアクション候補
1. 既存データに FOLLOWERS/PRIVATE が残っている場合の移行要否を判断

## 検証方法または確認手順
- バックエンド: `./gradlew test -g ../.gradle-tmp` 成功
- フロント: `npm run build` 成功
- 手動確認:
  - 新規投稿画面に公開範囲選択が出ない
  - 投稿詳細の公開範囲が PUBLIC で保存される
