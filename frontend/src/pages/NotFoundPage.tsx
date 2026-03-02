import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold">ページが見つかりません</h1>
      <p className="mt-4 text-slate-600">URLが正しいかご確認ください。</p>
      <Link className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 font-bold text-white hover:bg-primary/90" to="/">
        ホームへ戻る
      </Link>
    </div>
  )
}
