-- V1 で post_images は既に作成済みのため、ここでは重複 CREATE は行わない。
-- 「V2 が存在する」こと自体を明示しつつ、再実行でも安全な no-op migration とする。
DO $$
BEGIN
  -- no-op
END $$;
