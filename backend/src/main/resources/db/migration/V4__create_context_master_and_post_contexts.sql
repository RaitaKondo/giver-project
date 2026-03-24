CREATE TABLE IF NOT EXISTS context_master (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_contexts (
  post_id UUID NOT NULL,
  context_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, context_id),
  CONSTRAINT fk_post_contexts_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_contexts_context_master
    FOREIGN KEY (context_id) REFERENCES context_master(id)
);

CREATE INDEX IF NOT EXISTS idx_context_master_active_sort
  ON context_master(is_active, sort_order, id);

CREATE INDEX IF NOT EXISTS idx_post_contexts_context_id
  ON post_contexts(context_id);

INSERT INTO context_master (code, name, category, sort_order, is_active)
VALUES
  ('workplace', '職場', 'PLACE', 10, TRUE),
  ('family', '家族', 'RELATIONSHIP', 20, TRUE),
  ('relatives', '親戚', 'RELATIONSHIP', 30, TRUE),
  ('siblings', '兄弟', 'RELATIONSHIP', 40, TRUE),
  ('school', '学校', 'PLACE', 50, TRUE),
  ('train', '電車', 'PLACE', 60, TRUE)
ON CONFLICT (code) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = now();
