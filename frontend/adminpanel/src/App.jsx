import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Flights from './pages/Flights'
import Reservations from './pages/Reservations'
import Customers from './pages/Customers'
import Airplanes from './pages/Airplanes'
import Airports from './pages/Airports'
import AdminUsers from './pages/AdminUsers'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, hasRole } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="flights" element={<Flights />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="customers" element={<Customers />} />
        <Route path="airplanes" element={<Airplanes />} />
        <Route path="airports" element={
          <ProtectedRoute requiredRole="ADMIN">
            <Airports />
          </ProtectedRoute>
        } />
        <Route path="admin-users" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminUsers />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
