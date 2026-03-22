-- Aフェーズでは認証機能未導入のため、posts.author_id の NOT NULL/FK 制約を満たす
-- 暫定ユーザーとして guest を seed する。
INSERT INTO users (id, firebase_uid, display_name, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'guest-user',
  'Guest User',
  now()
)
ON CONFLICT DO NOTHING;
