import { Navigate, Route, Routes } from 'react-router-dom'
import { CreateRecordPage } from './pages/CreateRecordPage'
import { DashboardPage } from './pages/DashboardPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { FeedPage } from './pages/FeedPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { ProfilePage } from './pages/ProfilePage'
import { AppLayout } from './shared/layout/AppLayout'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<FeedPage />} path="/feed" />
        <Route element={<DiscoverPage />} path="/discover" />
        <Route element={<PostDetailPage />} path="/posts/:id" />
        <Route element={<CreateRecordPage />} path="/posts/new" />
        <Route element={<DashboardPage />} path="/me/dashboard" />
        <Route element={<ProfilePage />} path="/users/:id" />
        <Route element={<Navigate replace to="/" />} path="/home" />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  )
}

export default App
