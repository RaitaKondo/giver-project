import { Link } from 'react-router-dom'
import { posts } from '../mock/data'

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span className="text-xs font-bold uppercase tracking-widest">プライベートダッシュボード</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">振り返りと傾向</h1>
          <p className="mt-2 max-w-xl text-slate-500">記録のパターンを確認して、次に続ける行動を決めるための個人ビューです。</p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['総投稿数', '128', '+12%'],
          ['連続記録', '12日', '+4日'],
          ['保存した投稿', '36', '+6件'],
          ['フォロー中', '24', '+2人'],
        ].map(([label, value, diff]) => (
          <div className="min-h-[120px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-black">{value}</span>
              <span className="text-xs font-medium text-emerald-500">{diff}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">よく使うタグ</h3>
          <div className="mb-8 flex flex-wrap gap-2">
            {['#メンタリング', '#地域支援', '#環境', '#教育', '#キャリア'].map((tag, i) => (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  i === 0 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex h-44 items-end gap-3 px-2">
            {[40, 90, 60, 75, 30].map((height) => (
              <div className="flex-1 rounded-t-lg bg-primary/20 hover:bg-primary/40" key={height} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">今月の行動パターン</h3>
          <div className="space-y-5">
            {[
              ['phase_1', '迷い', '準備不足が主な要因'],
              ['phase_2', '設計', '小さな実行計画へ分解'],
              ['phase_3', '変化', '継続できる成果に接続'],
            ].map(([id, title, caption], index) => (
              <div className="flex items-center gap-4" key={id}>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index === 0
                      ? 'border-slate-300 bg-slate-100'
                      : index === 1
                        ? 'border-primary bg-primary/20'
                        : 'border-emerald-500 bg-emerald-500/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{index === 2 ? 'change_circle' : 'check_circle'}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs text-slate-500">{caption}</p>
                </div>
              </div>
            ))}
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
          {posts.map((post) => (
            <div className="rounded-xl border border-slate-200 bg-white p-5" key={`history-${post.id}`}>
              <div className="mb-3 flex flex-col justify-between gap-2 md:flex-row">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{post.createdAt}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{post.tags[0]}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {post.isPublic ? '公開投稿' : '非公開投稿'}
                </span>
              </div>
              <h4 className="mb-2 text-lg font-bold">{post.title}</h4>
              <p className="text-sm text-slate-600">{post.action}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
