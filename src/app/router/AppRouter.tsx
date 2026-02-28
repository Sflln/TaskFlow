import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../../pages/LoginPage/LoginPage'
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage'
import { DashboardPage } from '../../pages/DashboardPage/DashboardPage'
import { BoardPage } from '../../pages/BoardPage/BoardPage'
import { useAuthStore } from '../../store/authStore'
import type { JSX } from 'react'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/board/:id" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}