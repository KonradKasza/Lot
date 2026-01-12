import { useTranslation } from 'react-i18next';
import styles from './FooterBar.module.css';
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import paypal from '../assets/paypal.png';
import blik from '../assets/blik.jpg';

function FooterBar() {
    const {t,i18n } = useTranslation();
    const year = new Date().getFullYear();
 
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.left}> 
                    {year}{t('footer.rights')}
                </div>

                <div className={styles.center}>
                    <a href="#" className={styles.link}>Terms of Service</a>
                    <span className={styles.sep}>|</span>
                    <a href="#" className={styles.link}>Privacy</a>
                </div>

                <div className={styles.payments} aria-hidden>
                    <img src={visa} alt="Visa" />
                    <img src={mastercard} alt="Mastercard" />
                    <img src={paypal} alt="PayPal" />
                    <img src={blik} alt="Blik" />
                </div>
            </div>
        </footer>
    );
}

export default FooterBar;
