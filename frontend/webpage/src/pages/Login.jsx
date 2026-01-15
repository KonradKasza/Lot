import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//import { authService } from '../services/authService';
import { authService } from '../services/mockAuthService';
import FooterBar from '../components/FooterBar';
import styles from './Login.module.css';

function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const token = await authService.login(email, password);
            localStorage.setItem('authToken', token);
            localStorage.setItem('userEmail', email);
            window.location.hash = '#/';
            window.location.reload()
        } catch (err) {
            setError(err.message || t('login.error'));
        } finally {
            setIsLoading(false);
            
        }
    };

    return (
        <div>
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <h1>{t('login.title')}</h1>
                    <p>{t('login.subtitle')}</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">{t('login.email')}</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">{t('login.password')}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? t('login.loggingIn') : t('login.button')}
                        </button>
                    </form>

                    <div className={styles.links}>
                        <a href="#">{t('login.forgotPassword')}</a>
                        <span> | </span>
                        <a href="#">{t('login.signup')}</a>
                    </div>
                </div>
            </div>
            <FooterBar />
        </div>
    );
}

export default Login;
