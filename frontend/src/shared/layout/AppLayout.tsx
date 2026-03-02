import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background-light text-slate-900">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
