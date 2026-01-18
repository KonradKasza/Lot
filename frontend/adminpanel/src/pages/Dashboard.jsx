import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    flights: 0,
    reservations: 0,
    customers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
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
        flights: flights.totalItems || 0,
        reservations: reservations.totalItems || 0,
        customers: customers.totalItems || 0,
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Witaj, {user?.fullName || user?.username}! Rola: {user?.role}</p>

      <div className="stats-row">
        <div className="stat-box">
          <div className="number">{loading ? '...' : stats.flights}</div>
          <div className="label">Loty</div>
        </div>
        <div className="stat-box">
          <div className="number">{loading ? '...' : stats.reservations}</div>
          <div className="label">Rezerwacje</div>
        </div>
        <div className="stat-box">
          <div className="number">{loading ? '...' : stats.customers}</div>
          <div className="label">Klienci</div>
        </div>
      </div>

      <h3 className="section-title">Szybkie linki</h3>
      <ul className="links-list">
        <li><a href="/flights">Zarządzaj lotami</a></li>
        <li><a href="/reservations">Zobacz rezerwacje</a></li>
        <li><a href="/customers">Lista klientów</a></li>
        <li><a href="/airplanes">Samoloty</a></li>
      </ul>
    </div>
  )
}

export default Dashboard
