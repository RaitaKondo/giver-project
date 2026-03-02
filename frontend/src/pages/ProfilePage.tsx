import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PostCard } from '../features/posts/PostCard'
import { getUserById, posts } from '../mock/data'

export function ProfilePage() {
  const { id = '' } = useParams()
  const user = getUserById(id)
  const userPosts = useMemo(() => posts.filter((post) => post.authorId === id), [id])

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold">ユーザーが見つかりませんでした。</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img alt={user.name} className="h-28 w-28 rounded-full border-4 border-primary/20 object-cover" src={user.avatar} />
            <div className="max-w-xl">
              <h1 className="mb-1 text-2xl font-bold tracking-tight">{user.name}</h1>
              <p className="mb-3 text-slate-600">{user.bio}</p>
              <p className="text-sm text-slate-500">参加日: {user.joinedAt}</p>
            </div>
          </div>
          <div className="flex w-full gap-3 md:w-auto">
            <button className="flex-1 rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 md:flex-none">
              フォロー
            </button>
            <button className="flex-1 rounded-lg bg-slate-200 px-6 py-2.5 font-semibold text-slate-900 transition-colors hover:bg-slate-300 md:flex-none">
              保存済みを見る
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 text-lg font-bold">得意分野</h3>
        <div className="flex flex-wrap gap-2">
          {user.expertise.map((item) => (
            <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold">公開履歴</h3>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={`profile-${post.id}`} post={post} />)
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">公開投稿はまだありません。</p>
        )}
      </section>
    </div>
  )
}
