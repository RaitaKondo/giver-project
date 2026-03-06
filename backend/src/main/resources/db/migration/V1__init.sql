CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES users(id),
  title TEXT,
  action_text TEXT NOT NULL,
  conflict_text TEXT,
  change_text TEXT,
  visibility TEXT NOT NULL DEFAULT 'PUBLIC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

create table post_images (
  id uuid primary key,
  post_id uuid not null references posts(id) on delete cascade,
  object_name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null
);

create index idx_post_images_post_id on post_images(post_id);

CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL REFERENCES users(id),
  followee_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  user_id UUID NOT NULL REFERENCES users(id),
  post_id UUID NOT NULL REFERENCES posts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- 将来用（UIでは未使用）
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id, type)
);