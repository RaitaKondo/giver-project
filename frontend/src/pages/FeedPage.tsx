import { PostCard } from '../features/posts/PostCard'
import { FollowUserCard } from '../features/users/FollowUserCard'
import { posts, users } from '../mock/data'

export function FeedPage() {
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
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <aside className="space-y-6 lg:col-span-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-sky-600 p-6 text-white shadow-xl shadow-primary/10">
          <h3 className="text-lg font-bold">今週の振り返り</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            あなたが保存した投稿は 6 件です。実践した内容を次の記録につなげましょう。
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">おすすめユーザー</h3>
          {users.map((user) => (
            <FollowUserCard key={user.id} user={user} />
          ))}
        </div>
      </aside>
    </div>
  )
}
