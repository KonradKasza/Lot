import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from './Register.module.css';

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!username.trim()) {
            setError(t('register.errors.usernameRequired'));
            return false;
        }
        if (!email.trim()) {
            setError(t('register.errors.emailRequired'));
            return false;
        }
        if (!password.trim()) {
            setError(t('register.errors.passwordRequired'));
            return false;
        }
        if (password.length < 6) {
            setError(t('register.errors.passwordTooShort'));
            return false;
        }
        if (password !== confirmPassword) {
            setError(t('register.errors.passwordMismatch'));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.register(username, email, password);
            const token = response.token;
            localStorage.setItem('authToken', token);
            navigate('/');
        } catch (err) {
            setError(err.message || t('register.errors.registrationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
                <h1>{t('register.title')}</h1>
                <p>{t('register.subtitle')}</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username">{t('register.username')}</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('register.usernamePlaceholder')}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">{t('register.email')}</label>
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
                        <label htmlFor="password">{t('register.password')}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? t('register.creating') : t('register.button')}
                    </button>
                </form>

                <div className={styles.links}>
                    <span>{t('register.haveAccount')}</span>
                    <a href="#/login">{t('register.login')}</a>
                </div>
            </div>
        </div>
    );
}

export default Register;
