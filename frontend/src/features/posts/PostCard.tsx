import { Link } from 'react-router-dom'
import type { Post } from '../../types/models'

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {post.image ? <img alt={post.title} className="h-48 w-full object-cover" src={post.image} /> : null}
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img alt={post.authorName} className="h-10 w-10 rounded-full object-cover" src={post.authorAvatar} />
            <div>
              <h4 className="text-sm font-bold">{post.authorName}</h4>
              <p className="text-xs text-slate-500">
                {post.authorRole} ・ {post.createdAt}
              </p>
            </div>
          </div>
          <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:border-primary hover:text-primary">
            <span className="material-symbols-outlined text-base">bookmark</span>
          </button>
        </div>

        <Link className="block space-y-3" to={`/posts/${post.id}`}>
          <h3 className="text-xl font-bold leading-tight text-slate-900">{post.title}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400">行動</span>
              <p className="text-slate-600">{post.action}</p>
            </div>
            {post.outcome ? (
              <div className="rounded-r-lg border-l-4 border-primary bg-primary/10 p-3">
                <div className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-xs font-bold uppercase tracking-wider text-primary">結果</span>
                  <p className="font-medium text-slate-800">{post.outcome}</p>
                </div>
              </div>
            ) : null}
          </div>
        </Link>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500"
                key={`${post.id}-${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="material-symbols-outlined text-sm">public</span>
            {post.isPublic ? '公開' : '非公開'}
          </span>
        </div>
      </div>
    </article>
  )
}
