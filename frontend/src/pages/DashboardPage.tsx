import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMyPosts } from "../api/authApi";
import { useAuth } from "../features/auth/useAuth";
import { formatCreatedAt, toFeedPost } from "../features/posts/postMappers";
import { StatePanel } from "../shared/ui/StatePanel";
import type { Post } from "../types/models";

export function DashboardPage() {
  const { profile } = useAuth();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const page = await fetchMyPosts(0, 100);
        setAllPosts(page.content.map((post) => toFeedPost(post)));
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "ダッシュボードの取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const myPosts = allPosts;

  const stats = useMemo(() => {
    const uniqueTags = new Set(myPosts.flatMap((post) => post.tags));
    const recentPosts = myPosts.filter((post) => isInLastDays(post.createdAt, 30)).length;

    return [
      ["総投稿数", String(myPosts.length), `${recentPosts}件 / 30日`],
      ["よく使う文脈", String(uniqueTags.size), "タグ数"],
      ["画像付き投稿", String(myPosts.filter((post) => Boolean(post.image)).length), "全公開範囲"],
      ["ログイン名", profile?.displayName ?? "-", "認証ユーザー"],
    ] as const;
  }, [myPosts, profile?.displayName]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    myPosts.forEach((post) => {
      post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });

    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [myPosts]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="text-xs font-bold uppercase tracking-widest">プライベートダッシュボード</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">振り返りと傾向</h1>
          <p className="mt-2 max-w-xl text-slate-500">
            ログイン中のアカウントに紐づく投稿を集計しています。公開・限定公開・非公開をまとめて確認できます。
          </p>
        </div>
      </header>

      {isLoading ? <StatePanel message="ダッシュボードを読み込み中です..." /> : null}
      {!isLoading && errorMessage ? <StatePanel message={errorMessage} tone="error" /> : null}

      {!isLoading && !errorMessage ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([label, value, diff]) => (
              <div className="min-h-[120px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-3xl font-black">{value}</span>
                  <span className="text-xs font-medium text-slate-500">{diff}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">よく使うタグ</h3>
              <div className="mb-8 flex flex-wrap gap-2">
                {topTags.length > 0 ? (
                  topTags.map(([tag, count], i) => (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        i === 0 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      }`}
                      key={tag}
                    >
                      {tag} ({count})
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">投稿が増えるとタグ傾向を表示します。</span>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">今月のメモ</h3>
              <div className="space-y-4 text-sm text-slate-600">
                <p>ログイン中ユーザーの投稿だけを表示しています。</p>
                <p>フォロー・保存の詳細表示は次の拡張で追加しやすい構成にしています。</p>
                <p>プロフィール編集はヘッダーの「プロフィール編集」から開けます。</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-black">投稿履歴</h3>
              <Link className="text-sm font-bold text-primary hover:underline" to="/posts/new">
                新しい投稿を作成
              </Link>
            </div>
            <div className="space-y-3">
              {myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <div className="rounded-xl border border-slate-200 bg-white p-5" key={`history-${post.id}`}>
                    <div className="mb-3 flex flex-col justify-between gap-2 md:flex-row">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{formatCreatedAt(post.createdAt)}</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{post.tags[0]}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {post.isPublic ? "公開投稿" : "非公開投稿"}
                      </span>
                    </div>
                    <h4 className="mb-2 text-lg font-bold">{post.title}</h4>
                    <p className="text-sm text-slate-600">{post.action}</p>
                  </div>
                ))
              ) : (
                <StatePanel message="まだ投稿がありません。最初の記録を作成するとここに反映されます。" />
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function isInLastDays(value: string, days: number): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const thresholdMs = days * 24 * 60 * 60 * 1000;
  return diffMs <= thresholdMs;
}
