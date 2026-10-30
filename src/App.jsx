import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './hooks/useApp.js'

const LandingPage = lazy(() => import('./pages/landing/LandingPage.jsx'))
const AuthPage = lazy(() => import('./pages/auth/AuthPage.jsx'))
const PortalLayout = lazy(() => import('./components/layout/PortalLayout.jsx'))
const PortalPage = lazy(() => import('./pages/portal/PortalPage.jsx'))

function ProtectedPortal() {
  const { user } = useApp()
  return user ? <PortalLayout /> : <Navigate to="/login" replace />
}

export default function App() {
  const { user } = useApp()
  return <Suspense fallback={<div className="route-loading">Opening your school day…</div>}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/portal" replace /> : <AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
      <Route path="/reset-password" element={<AuthPage mode="reset" />} />
      <Route path="/portal" element={<ProtectedPortal />}>
        <Route index element={<PortalPage />} />
        <Route path=":section" element={<PortalPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
}
