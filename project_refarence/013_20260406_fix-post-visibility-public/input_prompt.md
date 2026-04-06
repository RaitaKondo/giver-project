# input_prompt

## ユーザー依頼の原文
新規投稿などにある公開範囲だが、全部パブリック固定にしたい

## この作業で扱う対象
- 投稿公開範囲を常に PUBLIC に固定
- フロントの公開範囲選択UI調整
- バックエンドで visibility を PUBLIC 強制

## 前提条件
- 現在 visibility は PUBLIC/FOLLOWERS/PRIVATE の選択式

## 制約事項
- 最終的に全投稿がPUBLICで保存されること

## 実施前の整理メモ
- UIだけ変更だとAPI直叩きで回避されるため、バックエンド側も固定化が必要

## 実施方針
1. フロントで選択UIを削除してPUBLIC固定表示に変更
2. バックエンドでvisibilityを常にPUBLICとして保存
3. テスト更新・実行
