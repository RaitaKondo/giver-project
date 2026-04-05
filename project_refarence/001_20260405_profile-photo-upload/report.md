# report

## 作業概要
プロフィール編集で「フォルダから1枚選択してアカウント写真を更新」する機能について、既存の投稿画像アップロード実装（GCS利用）を踏まえて、必要要件と実装タスクを整理した。

## 実施結果
- プロジェクト内の既存実装を確認し、投稿画像は `multipart/form-data` + バックエンド経由GCSアップロード + DBに`objectName`保存 + 配信時署名URL生成で実装されていることを確認。
- プロフィール更新は現状 `PATCH /api/me/profile` の JSON 更新のみで、`photoUrl` は文字列入力方式であることを確認。
- アカウント写真アップロード機能に必要な項目を、仕様/API/DB/セキュリティ/運用/テストの観点で定義。

## 変更ファイル一覧
- project_refarence/001_20260405_profile-photo-upload/input_prompt.md
- project_refarence/001_20260405_profile-photo-upload/report.md

## 主要な判断理由
- 既存の投稿画像方式との統一により、実装コスト・運用負荷・障害解析コストを抑えられるため。
- 既存 `photoUrl` 文字列直入力方式は、ユーザー操作・セキュリティ・整合性の観点で今回要件（フォルダから1枚選択）と合わないため。
- 画像機能はクライアント側チェックだけでは不十分であり、バックエンド側で枚数・サイズ・MIME検証を必須化すべきため。

## 調査内容と結論
調査内容:
- `frontend/src/pages/MeProfilePage.tsx` と `frontend/src/api/authApi.ts` のプロフィール更新実装
- `backend/src/main/java/com/giver/backend/user/controller/MeController.java` / `UserAccountService.java` の更新API
- 投稿画像アップロード実装 (`PostController` / `PostCommandService` / `GcsImageStorageService`)
- DBマイグレーション (`V5__add_user_profile_columns.sql`)

結論:
- 新規に「プロフィール画像専用アップロードAPI」を追加し、投稿画像と同様にGCSへ保存するのが最短かつ安全。
- 保存方式は `users.photo_url` に「署名URL」を直接保存せず、`objectName` など永続識別子保存方式へ寄せるのが望ましい（必要に応じてカラム追加）。
- 既存APIの完全置換ではなく、段階移行（旧 `photoUrl` との互換維持）を考慮するとリスクが低い。

## 未完了事項
- 実際のAPI/DB/フロント実装は未着手。
- 容量上限値（例: 2MB or 5MB）と許可拡張子・MIMEの最終決定が未確定。
- 既存ユーザーの `photo_url` データ移行方針の確定が未実施。

## 次のアクション候補
1. 仕様確定（最大サイズ、許可形式、上書き時の旧画像削除方針）
2. バックエンド実装（API + バリデーション + GCS保存 + 取得レスポンス反映）
3. フロント実装（ファイル選択UI、プレビュー、送信、エラーメッセージ）
4. 単体テスト/結合テスト追加
5. 運用設定反映（GCS権限、環境変数、監視）

## 検証方法または確認手順
- バックエンド:
  - `POST/PATCH /api/me/profile/photo` に `multipart/form-data` で画像1枚送信し、200系レスポンスになること
  - 上限超過・非画像MIME・2枚送信時に400系エラーになること
- フロントエンド:
  - ファイルダイアログから1枚のみ選択できること
  - サイズ上限超過時に送信前エラー表示されること
  - 更新後にプロフィール・ヘッダー・投稿者アイコンへ反映されること
- GCS:
  - 対象オブジェクトが期待パスへ保存されること
  - 旧画像削除ポリシーを採用する場合、更新時に不要オブジェクトが残らないこと
