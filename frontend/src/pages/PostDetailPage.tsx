import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchPostById, type PostDetailResponse } from "../api/postApi";
import { formatCreatedAt, toProfileSummary } from "../features/posts/postMappers";
import { StatePanel } from "../shared/ui/StatePanel";

export function PostDetailPage() {
  const { id = "" } = useParams();
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setErrorMessage("投稿が見つかりませんでした。");
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await fetchPostById(id);
        setPost(response);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "投稿詳細の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  const profile = useMemo(
    () => (post ? toProfileSummary(post.authorId, post.contexts) : null),
    [post],
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message="投稿を読み込み中です..." />
      </div>
    );
  }

  if (errorMessage || !post || !profile) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-14 sm:px-6 lg:px-8">
        <StatePanel message={errorMessage || "投稿が見つかりませんでした。"} tone="error" />
        <Link className="inline-flex font-bold text-primary hover:underline" to="/feed">
          フィードへ戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link className="hover:text-primary" to="/">
          ホーム
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link className="hover:text-primary" to="/feed">
          フィード
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">投稿詳細</span>
      </div>

      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img alt={profile.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30 ring-offset-4" src={profile.avatar} />
          <div>
            <h3 className="text-xl font-bold">{profile.name}</h3>
            <p className="text-sm text-slate-500">
              {profile.expertise[0] ?? "コミュニティメンバー"} ・ {formatCreatedAt(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary/90">
            フォロー
          </button>
          <button className="rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-primary hover:text-primary">
            <span className="material-symbols-outlined">bookmark</span>
          </button>
        </div>
      </div>

      <article className="space-y-10">
        <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl">
          {post.title?.trim() || "無題の投稿"}
        </h1>

        {post.contexts.length > 0 ? (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
              日常文脈
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.contexts.map((context) => (
                <span
                  className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700"
                  key={`${post.id}-${context.id}`}
                >
                  {context.name}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">info</span> 行動
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">{post.actionText}</p>
        </section>

        {post.conflictText ? (
          <section className="rounded-xl border-l-4 border-primary bg-primary/5 p-6 italic text-slate-700">
            <h2 className="mb-3 text-sm font-bold not-italic text-slate-900">迷い・葛藤</h2>
            {post.conflictText}
          </section>
        ) : null}

        {post.changeText ? (
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-sm">trending_up</span> 結果
            </h2>
            <p className="text-lg leading-relaxed text-slate-700">{post.changeText}</p>
          </section>
        ) : null}

        {post.images.length > 0 ? (
          <section>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">画像</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {post.images.map((image) => (
                <img
                  alt={`${post.title?.trim() || "投稿"} の画像`}
                  className="w-full rounded-2xl object-cover shadow-sm"
                  key={image.id}
                  src={image.url}
                />
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <footer className="mt-16 border-t border-slate-200 pt-8 text-sm text-slate-500">公開範囲: {post.visibility}</footer>
    </div>
  );
}
