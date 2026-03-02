import { Link } from 'react-router-dom'
import type { User } from '../../types/models'

type FollowUserCardProps = {
  user: User
}

export function FollowUserCard({ user }: FollowUserCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <Link className="flex min-w-0 items-center gap-3" to={`/users/${user.id}`}>
        <img alt={user.name} className="h-9 w-9 rounded-full object-cover" src={user.avatar} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.expertise[0]}</p>
        </div>
      </Link>
      <button className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white">
        フォロー
      </button>
    </div>
  )
}
