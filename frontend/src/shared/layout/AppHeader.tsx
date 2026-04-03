import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'

const navItems = [
  { to: '/', label: 'ホーム' },
  { to: '/feed', label: 'フィード' },
  { to: '/discover', label: '見つける' },
  { to: '/me/dashboard', label: 'ダッシュボード' },
]

export function AppHeader() {
  const navigate = useNavigate()
  const { isAuthenticated, profile, signOutUser } = useAuth()

  const handleSignOut = async () => {
    await signOutUser()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-background-light/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-xl">volunteer_activism</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">ギビング・サークル</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {profile ? (
                <Link
                  className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary sm:inline-flex"
                  to={`/users/${profile.id}`}
                >
                  マイプロフィール
                </Link>
              ) : null}
              <Link
                className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary sm:inline-flex"
                to="/me/profile"
              >
                プロフィール編集
              </Link>
              <button
                className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary sm:inline-flex"
                type="button"
                onClick={handleSignOut}
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary hover:text-primary sm:inline-flex"
              to="/login"
            >
              ログイン
            </Link>
          )}
          <Link
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            to={isAuthenticated ? "/posts/new" : "/login?redirect=%2Fposts%2Fnew"}
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            {isAuthenticated ? '新規投稿' : 'ログイン'}
          </Link>
        </div>
      </div>
    </header>
  )
}
