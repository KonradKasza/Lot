import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalReservations: 0,
    totalCustomers: 0,
    todayFlights: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Simple stats from existing endpoints
      const token = localStorage.getItem('adminToken')
      const headers = { Authorization: `Bearer ${token}` }

      const [flightsRes, reservationsRes, customersRes] = await Promise.all([
        fetch('/api/admin/flights?page=0&size=1', { headers }),
        fetch('/api/admin/reservations?page=0&size=1', { headers }),
        fetch('/api/admin/customers?page=0&size=1', { headers }),
      ])

      const [flights, reservations, customers] = await Promise.all([
        flightsRes.json(),
        reservationsRes.json(),
        customersRes.json(),
      ])

      setStats({
        totalFlights: flights.totalItems || 0,
        totalReservations: reservations.totalItems || 0,
        totalCustomers: customers.totalItems || 0,
        todayFlights: Math.floor(Math.random() * 50) + 10, // Placeholder
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (role) => {
    return t(`dashboard.roleDescriptions.${role}`)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.welcome')}, {user?.fullName || user?.username}!</p>
      </div>

      <div className="role-info-card">
        <div className="role-info-header">
          <span className={`role-badge badge-${user?.role?.toLowerCase()}`}>
            {user?.role}
          </span>
          <span className="role-title">{t('dashboard.yourRole')}</span>
        </div>
        <p className="role-description">{getRoleDescription(user?.role)}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">✈️</div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalFlights.toLocaleString()}</div>
            <div className="stat-label">{t('dashboard.totalFlights')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalReservations.toLocaleString()}</div>
            <div className="stat-label">{t('dashboard.totalReservations')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.totalCustomers.toLocaleString()}</div>
            <div className="stat-label">{t('dashboard.totalCustomers')}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛩️</div>
          <div className="stat-content">
            <div className="stat-value">{loading ? '...' : stats.todayFlights}</div>
            <div className="stat-label">{t('dashboard.totalAirplanes')}</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>{t('dashboard.quickActions')}</h2>
        <div className="actions-grid">
          <a href="/flights" className="action-card">
            <span className="action-icon">✈️</span>
            <span className="action-title">{t('dashboard.manageFlights')}</span>
            <span className="action-desc">{t('dashboard.manageFlightsDesc')}</span>
          </a>
          <a href="/reservations" className="action-card">
            <span className="action-icon">📋</span>
            <span className="action-title">{t('dashboard.viewReservations')}</span>
            <span className="action-desc">{t('dashboard.viewReservationsDesc')}</span>
          </a>
          <a href="/customers" className="action-card">
            <span className="action-icon">👥</span>
            <span className="action-title">{t('dashboard.customerData')}</span>
            <span className="action-desc">{t('dashboard.customerDataDesc')}</span>
          </a>
          <a href="/airplanes" className="action-card">
            <span className="action-icon">🛩️</span>
            <span className="action-title">{t('nav.airplanes')}</span>
            <span className="action-desc">{t('dashboard.totalAirplanes')}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
