import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from './Navbar.module.css';

function Navbar() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [languageOpen, setLanguageOpen] = useState(false);
    const isAuthenticated = authService.isAuthenticated();

    const toggleLanguageMenu = () => {
        setLanguageOpen(!languageOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguageOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        authService.logout();
        localStorage.removeItem('userEmail');
        //navigate('/');
        window.location.hash = '#/';
        window.location.reload()
    };

    const handleCustomerInfoClick = () => {
        navigate('/customer-info');
    };

    const userEmail = localStorage.getItem('userEmail');

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <button className={styles.logo} onClick={handleLogoClick}>
                        <img src="/logo.svg" alt="LOT Logo" className={styles.logoImage} />
                        <span className={styles.logoText}>LOT</span>
                    </button>
                </div>
                <ul className={styles.navLinks}>
                    <li>
                        <button onClick={() => navigate('/search')} className={styles.link}>
                            {t('navbar.flightSearch')}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => navigate('/faq')} className={styles.link}>
                            {t('navbar.faq')}
                        </button>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <button onClick={() => navigate('/bookings')} className={styles.link}>
                                {t('navbar.myBookings')}
                            </button>
                        </li>
                    )}
                    <li className={styles.languageSelector}>
                        <button
                            className={styles.languageButton}
                            onClick={toggleLanguageMenu}
                        >
                            {i18n.language.toUpperCase()}
                        </button>
                        {languageOpen && (
                            <div className={styles.languageMenu}>
                                <button
                                    className={`${styles.languageOption} ${i18n.language === 'en' ? styles.active : ''}`}
                                    onClick={() => changeLanguage('en')}
                                >
                                    English
                                </button>
                                <button
                                    className={`${styles.languageOption} ${i18n.language === 'pl' ? styles.active : ''}`}
                                    onClick={() => changeLanguage('pl')}
                                >
                                    Polski
                                </button>
                            </div>
                        )}
                    </li>
                    <li>
                        {isAuthenticated ? (
                            <div className={styles.authButtons}>
                                <button className={styles.userInfoButton} onClick={handleCustomerInfoClick}>
                                    Logged in as {userEmail}
                                </button>
                                <button className={styles.logoutButton} onClick={handleLogout}>
                                    {t('navbar.logout')}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.authButtons}>
                                <button className={styles.loginButton} onClick={handleLoginClick}>
                                    {t('navbar.login')}
                                </button>
                                <button className={styles.signupButton} onClick={() => navigate('/register')}>
                                    {t('navbar.signup')}
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;