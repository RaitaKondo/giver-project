import { useEffect, useMemo, useState } from "react";

import { fetchPosts } from "../api/postApi";
import { PostCard } from "../features/posts/PostCard";
import { toFeedPost, toProfileSummary } from "../features/posts/postMappers";
import { FollowUserCard } from "../features/users/FollowUserCard";
import { StatePanel } from "../shared/ui/StatePanel";
import type { Post, User } from "../types/models";

export function FeedPage() {
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await fetchPosts();
        setFeedPosts(data.content.map((post) => toFeedPost(post)));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "投稿の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const recommendedUsers = useMemo<User[]>(() => {
    const seen = new Set<string>();

    return feedPosts
      .filter((post) => {
        if (seen.has(post.authorId)) {
          return false;
        }
        seen.add(post.authorId);
        return true;
      })
      .slice(0, 5)
      .map((post) => {
        const profile = toProfileSummary(post.authorId, []);
        return {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          bio: profile.bio,
          expertise: [post.authorRole],
          joinedAt: profile.joinedAt,
        };
      });
  }, [feedPosts]);

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:px-8">
      <aside className="space-y-4 lg:col-span-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-lg font-bold">投稿のヒント</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>具体的な行動を1つ書く</li>
            <li>迷った点を正直に残す</li>
            <li>結果は数字か変化で書く</li>
          </ul>
        </div>
      </aside>

      <section className="space-y-6 lg:col-span-6">
        {isLoading ? <StatePanel message="投稿を読み込み中です..." /> : null}

        {!isLoading && errorMessage ? <StatePanel message={errorMessage} tone="error" /> : null}

        {!isLoading && !errorMessage && feedPosts.length === 0 ? <StatePanel message="まだ投稿がありません。" /> : null}

        {!isLoading && !errorMessage
          ? feedPosts.map((post) => <PostCard key={post.id} post={post} />)
          : null}
      </section>

      <aside className="space-y-6 lg:col-span-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-sky-600 p-6 text-white shadow-xl shadow-primary/10">
          <h3 className="text-lg font-bold">今週の振り返り</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            直近の公開投稿を見ながら、次の実践に使えるアイデアをメモしましょう。
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">おすすめユーザー</h3>
          {recommendedUsers.length > 0
            ? recommendedUsers.map((user) => <FollowUserCard key={user.id} user={user} />)
            : <StatePanel message="投稿データが増えると、おすすめユーザーが表示されます。" />}
        </div>
      </aside>
    </div>
  );
}
