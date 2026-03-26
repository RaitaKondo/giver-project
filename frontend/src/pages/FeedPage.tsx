import { useEffect, useState } from "react";

import { fetchPosts, type PostSummaryResponse } from "../api/postApi";
import { PostCard } from "../features/posts/PostCard";
import { FollowUserCard } from "../features/users/FollowUserCard";
import { users } from "../mock/data";
import type { Post } from "../types/models";

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
        setFeedPosts(
          data.content.map((post, index) => toFeedPost(post, index)),
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "投稿の取得に失敗しました。",
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

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
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            投稿を読み込み中です...
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && feedPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            まだ投稿がありません。
          </div>
        ) : null}

        {!isLoading && !errorMessage
          ? feedPosts.map((post) => <PostCard key={post.id} post={post} />)
          : null}
      </section>

      <aside className="space-y-6 lg:col-span-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-sky-600 p-6 text-white shadow-xl shadow-primary/10">
          <h3 className="text-lg font-bold">今週の振り返り</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            あなたが保存した投稿は 6
            件です。実践した内容を次の記録につなげましょう。
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            おすすめユーザー
          </h3>
          {users.map((user) => (
            <FollowUserCard key={user.id} user={user} />
          ))}
        </div>
      </aside>
    </div>
  );
}

function toFeedPost(post: PostSummaryResponse, index: number): Post {
  const mockUser = users[index % users.length];

  return {
    id: post.id,
    authorId: post.authorId,
    authorName: mockUser.name,
    authorAvatar: mockUser.avatar,
    authorRole: mockUser.expertise[0] ?? "コミュニティメンバー",
    createdAt: formatCreatedAt(post.createdAt),
    title: post.title?.trim() || "無題の投稿",
    action: post.actionTextPreview,
    outcome: post.changeText ?? undefined,
    tags: post.contexts.map((context) => `#${context.name}`),
    image: post.thumbnailUrl ?? undefined,
    isPublic: post.visibility === "PUBLIC",
  };
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
