import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('adminToken')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (token) => {
    try {
      const userData = await authService.validateToken(token)
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('adminToken')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (emailOrUsername, password) => {
    const response = await authService.login(emailOrUsername, password)
    if (response.status === 'SUCCESS') {
      localStorage.setItem('adminToken', response.jwt)
      setUser({
        adminId: response.adminId,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
      })
      return { success: true }
    }
    return { success: false, message: response.message || 'Login failed' }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
  }

  const hasRole = (requiredRole) => {
    if (!user) return false
    const roleHierarchy = { WORKER: 1, MANAGER: 2, ADMIN: 3 }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const canEdit = () => hasRole('MANAGER')
  const canDelete = () => hasRole('ADMIN')
  const isAdmin = () => user?.role === 'ADMIN'

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    canEdit,
    canDelete,
    isAdmin,
  }

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
