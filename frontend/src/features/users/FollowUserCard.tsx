import { useState } from 'react'
import { Link } from 'react-router-dom'
import { followUser, unfollowUser } from '../../api/authApi'
import { useAuth } from '../auth/useAuth'
import type { User } from '../../types/models'

type FollowUserCardProps = {
  user: User
}

export function FollowUserCard({ user }: FollowUserCardProps) {
  const { isAuthenticated } = useAuth()
  const [isFollowing, setIsFollowing] = useState(Boolean(user.isFollowing))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/users/${user.id}`)}`
      return
    }

    setIsSubmitting(true)
    try {
      if (isFollowing) {
        await unfollowUser(user.id)
        setIsFollowing(false)
      } else {
        await followUser(user.id)
        setIsFollowing(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <Link className="flex min-w-0 items-center gap-3" to={`/users/${user.id}`}>
        <img alt={user.name} className="h-9 w-9 rounded-full object-cover" src={user.avatar} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.expertise[0]}</p>
        </div>
      </Link>
      <button
        className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
        disabled={isSubmitting}
        type="button"
        onClick={handleFollowToggle}
      >
        {isFollowing ? 'フォロー中' : 'フォロー'}
      </button>
    </div>
  )
}
