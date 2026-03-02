import { Link } from 'react-router-dom'
import { PostCard } from '../features/posts/PostCard'
import { FollowUserCard } from '../features/users/FollowUserCard'
import { posts, users } from '../mock/data'

export function DiscoverPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">見つける</h1>
            <p className="mt-2 text-slate-600">関心の近い実践を探して、フォローや保存で学びを蓄積できます。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#教育', '#環境', '#キャリア', '#地域連携'].map((tag) => (
              <button
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                key={tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="space-y-4 lg:col-span-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-lg font-bold">注目ユーザー</h3>
            <div className="space-y-3">
              {users.map((user) => (
                <FollowUserCard key={user.id} user={user} />
              ))}
            </div>
            <Link className="mt-4 inline-flex text-sm font-bold text-primary hover:underline" to="/feed">
              フィード全体を見る
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
