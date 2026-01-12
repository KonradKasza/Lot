import { useTranslation } from 'react-i18next';
import FooterBar from '../components/FooterBar';
import styles from './MyBookings.module.css';

function MyBookings() {
    const { t } = useTranslation();

    const bookings = [
        {
            id: 1,
            flightNumber: 'test',
            from: 'AAA',
            to: 'AAA',
            date: '2026',
            time: '10',
            passenger: 'Abc',
            status: 'STATUS',
        },
    ];

    return (
        <div>
            <div className={styles.bookingsPage}>

                <div className={styles.bookingsContainer}>
                    <h1>{t('bookings.title')}</h1>

                    {bookings.length > 0 ? (
                        <div className={styles.bookingsList}>
                            {bookings.map((booking) => (
                                <div key={booking.id} className={styles.bookingCard}>
                                    <div className={styles.bookingHeader}>
                                        <div className={styles.flightInfo}>
                                            <h3>{booking.flightNumber}</h3>
                                            <p className={styles.route}>
                                                {booking.from} → {booking.to}
                                            </p>
                                        </div>
                                        <div
                                            className={`${styles.status} ${styles[booking.status]}`}
                                        >
                                            {t(`bookings.status.${booking.status}`)}
                                        </div>
                                    </div>

                                    <div className={styles.bookingDetails}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.date')}:
                                            </span>
                                            <span>{booking.date}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.time')}:
                                            </span>
                                            <span>{booking.time}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.passenger')}:
                                            </span>
                                            <span>{booking.passenger}</span>
                                        </div>
                                    </div>

                                    <div className={styles.bookingActions}>
                                        <button className={styles.btnSecondary}>
                                            {t('bookings.viewDetails')}
                                        </button>
                                        <button className={styles.btnDanger}>
                                            {t('bookings.cancel')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noBookings}>
                            <p>{t('bookings.noBookings')}</p>
                        </div>
                    )}
                </div>
                <FooterBar />
            </div>
        </div>
    );
}

export default MyBookings;
