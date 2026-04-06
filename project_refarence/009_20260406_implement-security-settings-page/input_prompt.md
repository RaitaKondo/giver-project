# input_prompt

## ユーザー依頼の原文
認証メールは迷惑メールフォルダに届いてた。メール内の認証リンクをクリックすると動作するが認証後にトップページに繊維するように設定などはできない？
プロフィール編集画面のセキュリティ設定セクションだけど、新しいページに遷移して操作するようにしたい。
ここまでで懸念点はある？
はい

## この作業で扱う対象
- メール変更リンク完了後のトップページ遷移設定
- セキュリティ設定セクションの別ページ化

## 前提条件
- フロントは Firebase verifyBeforeUpdateEmail を利用
- App は React Router で構成されている

## 制約事項
- 既存プロフィール編集機能は維持
- セキュリティ操作は認証必須ページで提供

## 実施前の整理メモ
- ActionCodeSettings の continue URL を利用して遷移を制御する
- 現行 MeProfilePage のセキュリティフォームを新ページへ移設する

## 実施方針
1. `/me/security` ルートとページを追加
2. MeProfilePage からセキュリティ設定UIを分離し導線リンク化
3. verifyBeforeUpdateEmail に ActionCodeSettings を追加
4. フロントビルドで検証
