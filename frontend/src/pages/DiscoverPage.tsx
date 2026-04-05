import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMyFollows } from "../api/authApi";
import { fetchPosts, type PostSummaryResponse } from "../api/postApi";
import { useAuth } from "../features/auth/useAuth";
import { PostCard } from "../features/posts/PostCard";
import { toFeedPost, toProfileSummary } from "../features/posts/postMappers";
import { FollowUserCard } from "../features/users/FollowUserCard";
import { StatePanel } from "../shared/ui/StatePanel";
import type { Post, User } from "../types/models";

export function DiscoverPage() {
  const { isAuthenticated, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [rawPosts, setRawPosts] = useState<PostSummaryResponse[]>([]);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [page, followOverview] = await Promise.all([
          fetchPosts("PUBLIC", 0, 30),
          isAuthenticated ? fetchMyFollows() : Promise.resolve(null),
        ]);
        setRawPosts(page.content);
        setPosts(page.content.map((post) => toFeedPost(post)));
        setFollowedUserIds(followOverview?.followingUsers.map((user) => user.id) ?? []);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "投稿の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isAuthenticated]);

  const topTags = useMemo(() => {
    const countByTag = new Map<string, number>();
    rawPosts.forEach((post) => {
      post.contexts.forEach((context) => {
        countByTag.set(context.name, (countByTag.get(context.name) ?? 0) + 1);
      });
    });

    return [...countByTag.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
  }, [rawPosts]);

  const visiblePosts = useMemo(() => {
    if (selectedTag === "all") {
      return posts;
    }
    return posts.filter((post) => post.tags.includes(`#${selectedTag}`));
  }, [posts, selectedTag]);

  const users = useMemo<User[]>(() => {
    const seen = new Set<string>();
    const followed = new Set(followedUserIds);

    return rawPosts
      .filter((post) => {
        if (profile && post.authorId === profile.id) {
          return false;
        }
        if (followed.has(post.authorId)) {
          return false;
        }
        if (seen.has(post.authorId)) {
          return false;
        }
        seen.add(post.authorId);
        return true;
      })
      .slice(0, 5)
      .map((post) => {
        const profile = toProfileSummary(
          post.authorId,
          post.authorDisplayName,
          post.authorPhotoUrl,
          post.contexts,
        );
        return {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          bio: profile.bio,
          expertise: profile.expertise,
          joinedAt: profile.joinedAt,
        };
      });
  }, [rawPosts, followedUserIds, profile]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">見つける</h1>
            <p className="mt-2 text-slate-600">関心の近い実践を探して、フォローや保存で学びを蓄積できます。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedTag === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-slate-300 hover:border-primary hover:text-primary"
              }`}
              type="button"
              onClick={() => setSelectedTag("all")}
            >
              すべて
            </button>
            {topTags.map((tag) => (
              <button
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 hover:border-primary hover:text-primary"
                }`}
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {isLoading ? <StatePanel message="投稿を読み込み中です..." /> : null}
          {!isLoading && errorMessage ? <StatePanel message={errorMessage} tone="error" /> : null}
          {!isLoading && !errorMessage && visiblePosts.length === 0 ? (
            <StatePanel message="条件に一致する投稿がありません。タグを切り替えて試してください。" />
          ) : null}
          {!isLoading && !errorMessage
            ? visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
            : null}
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-lg font-bold">注目ユーザー</h3>
            <div className="space-y-3">
              {users.length > 0
                ? users.map((user) => <FollowUserCard key={user.id} user={user} />)
                : <StatePanel message="公開投稿が増えると注目ユーザーが表示されます。" />}
            </div>
            <Link className="mt-4 inline-flex text-sm font-bold text-primary hover:underline" to="/feed">
              フィード全体を見る
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
