import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import styles from './Home.module.css';

function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div>
            <div className={styles.homeContainer}>
                <section className={styles.hero}>
                    <h1>{t('home.title')}</h1>
                    <p>{t('home.subtitle')}</p>
                    <button 
                        className={styles.ctaButton}
                        onClick={() => navigate('/search')}
                    >
                        {t('home.searchFlights')}
                    </button>
                </section>
            </div>
            <FooterBar />
        </div>
    );
}

export default Home;
