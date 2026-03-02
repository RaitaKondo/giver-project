import { Link, useParams } from 'react-router-dom'
import { getPostById } from '../mock/data'

export function PostDetailPage() {
  const { id = '' } = useParams()
  const post = getPostById(id)

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold">投稿が見つかりませんでした。</p>
        <Link className="mt-4 inline-flex font-bold text-primary hover:underline" to="/feed">
          フィードへ戻る
        </Link>
      </div>
    )
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
          <img alt={post.authorName} className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/30 ring-offset-4" src={post.authorAvatar} />
          <div>
            <h3 className="text-xl font-bold">{post.authorName}</h3>
            <p className="text-sm text-slate-500">{post.authorRole}</p>
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
        <h1 className="text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-5xl">{post.title}</h1>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">info</span> 行動
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">{post.action}</p>
        </section>

        <section className="rounded-xl border-l-4 border-primary bg-primary/5 p-6 italic text-slate-700">
          <h2 className="mb-3 text-sm font-bold not-italic text-slate-900">迷い・葛藤</h2>
          {post.hesitation}
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-sm">trending_up</span> 結果
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">{post.outcome}</p>
        </section>

        <section className="rounded-2xl bg-slate-900 p-8 text-white shadow-xl">
          <h2 className="mb-4 text-sm font-bold text-primary">次に活かす学び</h2>
          <p className="text-slate-300">{post.lesson}</p>
        </section>
      </article>

      <footer className="mt-16 border-t border-slate-200 pt-8">
        <h4 className="text-lg font-bold">関連タグ</h4>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium" key={`${post.id}-${tag}`}>
              {tag}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
