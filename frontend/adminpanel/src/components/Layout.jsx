import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge-admin'
      case 'MANAGER': return 'badge-manager'
      case 'WORKER': return 'badge-worker'
      default: return ''
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>LOT Admin</h1>
          <span className="subtitle">Management Panel</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Dashboard
          </NavLink>
          <NavLink to="/flights" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Flights
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Reservations
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Customers
          </NavLink>
          <NavLink to="/airplanes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Airplanes
          </NavLink>
          <NavLink to="/crews" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Crews
          </NavLink>
          <NavLink to="/crew-members" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            Crew Members
          </NavLink>
          
          {isAdmin() && (
            <>
              <div className="nav-divider">Admin Only</div>
              <NavLink to="/airports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon"></span>
                Airports
              </NavLink>
              <NavLink to="/admin-users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon"></span>
                Admin Users
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className="user-email">{user?.email}</div>
            <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
