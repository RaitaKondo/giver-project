# report

## 作業概要
メールアドレス・パスワード変更機能（Firebase連携 + DB email整合）の実装に向けた懸念点と実施手順を整理した。

## 実施結果
- 現行コードでは `users.email` が `upsertFromFirebase` で Firebase トークン由来で更新される構成を確認。
- 同時に `/api/me/profile` でも email を直接更新できるため、Firebase Auth とDBが不整合になるリスクを確認。
- パスワードはDBに保持していないため、Firebase Authのみ更新対象であることを確認。
- 実行時の懸念点と段階的手順を定義。

## 変更ファイル一覧
- `project_refarence/004_20260405_email-password-change-plan/input_prompt.md`
- `project_refarence/004_20260405_email-password-change-plan/report.md`

## 主要な判断理由
- 認証の正は Firebase Auth であり、メール/パスワード更新も Firebase 側を基準にすべき。
- email をDBだけ更新可能なAPIを残すと、一貫性が崩れやすい。
- パスワード更新はセキュリティ上、再認証を伴うクライアントSDKフローが必要。

## 調査内容と結論
調査:
- `frontend/src/features/auth/AuthProvider.tsx`
- `backend/src/main/java/com/giver/backend/auth/FirebaseAuthenticationFilter.java`
- `backend/src/main/java/com/giver/backend/user/service/UserAccountService.java`
- `backend/src/main/java/com/giver/backend/user/controller/MeController.java`

結論:
- メール変更は Firebase で更新し、更新後の新IDトークンを使ったAPIアクセスで `users.email` を同期するのが安全。
- パスワード変更は Firebase の再認証 + 更新フローを採用し、バックエンドに平文パスワードを渡さない設計にする。
- `/api/me/profile` の email 直接更新は廃止または無効化が望ましい。

## 未完了事項
- 実装は未着手（今回は計画整理のみ）。

## 次のアクション候補
1. 仕様確定（メール変更は検証後反映か即時反映か、失効ポリシー）
2. フロント実装（再認証/メール変更/パスワード変更UI）
3. バックエンド調整（email直接更新禁止、同期エンドポイント整理）
4. テスト追加（正常/失敗/再認証必須ケース）

## 検証方法または確認手順
- 仕様確定後に実装し、以下を確認
  - Firebase側 email/password が変更される
  - 次回APIアクセスで `users.email` が Firebase と一致する
  - 失敗時にDBだけ更新されるケースが発生しない
