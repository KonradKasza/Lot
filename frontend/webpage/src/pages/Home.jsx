import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FlightSearch from '../components/FlightSearch';
import FooterBar from '../components/FooterBar';
import styles from './Home.module.css';

function Home() {
    const { t } = useTranslation();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div>
            <div className={styles.homeContainer}>
                {!showSearch ? (
                    <section className={styles.hero}>
                        <h1>{t('home.title')}</h1>
                        <p>{t('home.subtitle')}</p>
                        <button 
                            className={styles.ctaButton}
                            onClick={() => setShowSearch(true)}
                        >
                            {t('home.searchFlights')}
                        </button>
                    </section>
                ) : (
                    <div className={styles.searchWrapper}>
                        <button 
                            className={styles.backButton}
                            onClick={() => setShowSearch(false)}
                        >
                            ← {t('home.back')}
                        </button>
                        <FlightSearch />
                    </div>
                )}
            </div>
            <FooterBar />
        </div>
    );
}

export default Home;
