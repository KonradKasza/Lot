import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const { t, i18n } = useTranslation()
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(emailOrUsername, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(t('login.invalidCredentials'))
      }
    } catch (err) {
      setError(t('common.errorOccurred'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-lang-switcher">
          <button 
            className={`login-lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button 
            className={`login-lang-btn ${i18n.language === 'pl' ? 'active' : ''}`}
            onClick={() => changeLanguage('pl')}
          >
            PL
          </button>
        </div>
        <div className="login-header">
          <h1>{t('login.title')}</h1>
          <p>{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="emailOrUsername">{t('login.email')}</label>
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder={t('login.email')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password')}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>

        <div className="login-footer">
          <p>{t('login.testCredentials')}:</p>
          <ul>
            <li><strong>Worker:</strong> worker@lot.com / worker123</li>
            <li><strong>Manager:</strong> manager@lot.com / manager123</li>
            <li><strong>Admin:</strong> superadmin@lot.com / admin123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
