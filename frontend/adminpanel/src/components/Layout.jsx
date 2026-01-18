import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

function Layout() {
  const { i18n } = useTranslation()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>LOT Admin</h1>
          <span className="subtitle">Panel</span>
        </div>

        <div className="language-switcher">
          <button 
            className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`lang-btn ${i18n.language === 'pl' ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage('pl')}
          >
            PL
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Dashboard
          </NavLink>
          <NavLink to="/flights" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Loty
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Rezerwacje
          </NavLink>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Klienci
          </NavLink>
          <NavLink to="/airplanes" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Samoloty
          </NavLink>
          
          {isAdmin() && (
            <>
              <div className="nav-divider">Admin</div>
              <NavLink to="/airports" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Lotniska
              </NavLink>
              <NavLink to="/admin-users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Użytkownicy
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Wyloguj
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
