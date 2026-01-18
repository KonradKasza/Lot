import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout() {
  const { t, i18n } = useTranslation()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
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
          <span className="subtitle">{t('nav.managementPanel')}</span>
        </div>

        <div className="language-switcher">
          <button 
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${i18n.language === 'pl' ? 'active' : ''}`}
            onClick={() => changeLanguage('pl')}
          >
            PL
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.dashboard')}
          </NavLink>
          <NavLink to="/flights" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.flights')}
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.reservations')}
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.customers')}
          </NavLink>
          <NavLink to="/airplanes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.airplanes')}
          </NavLink>
          <NavLink to="/crews" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.crews')}
          </NavLink>
          <NavLink to="/crew-members" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon"></span>
            {t('nav.crewMembers')}
          </NavLink>
          
          {isAdmin() && (
            <>
              <div className="nav-divider">{t('nav.adminOnly')}</div>
              <NavLink to="/airports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon"></span>
                {t('nav.airports')}
              </NavLink>
              <NavLink to="/admin-users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                <span className="nav-icon"></span>
                {t('nav.adminUsers')}
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
            {t('nav.logout')}
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
