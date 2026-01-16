import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import styles from './MyBookings.module.css';
import { getUserBookings, cancelBooking } from '../services/mockbookedFlightsService';

function MyBookings() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(null);

    // Fetch bookings on component mount
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            navigate('/login');
            return;
        }

        fetchBookings(userEmail);
    }, [navigate]);

    const fetchBookings = async (userEmail) => {
        try {
            setLoading(true);
            const response = await getUserBookings(userEmail);
            if (response.success) {
                setBookings(response.bookings);
            } else {
                setError(response.error || t('bookings.loadError'));
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(t('bookings.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm(t('bookings.confirmCancel'))) {
            return;
        }

        const userEmail = localStorage.getItem('userEmail');
        setCancelling(bookingId);

        try {
            const response = await cancelBooking(bookingId, userEmail);
            if (response.success) {
                // Update local state
                setBookings((prev) =>
                    prev.map((b) =>
                        b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
                    )
                );
            } else {
                setError(response.error || t('bookings.cancelError'));
            }
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError(t('bookings.cancelError'));
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <>
                <div className={styles.bookingsPage}>
                    <div className={styles.bookingsContainer}>
                        <p>{t('bookings.loading')}</p>
                    </div>
                </div>
                <FooterBar />
            </>
        );
    }

    return (
        <div>
            <div className={styles.bookingsPage}>
                <div className={styles.bookingsContainer}>
                    <h1>{t('bookings.title')}</h1>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {bookings.length > 0 ? (
                        <div className={styles.bookingsList}>
                            {bookings.map((booking) => (
                                <div key={booking.booking_id} className={styles.bookingCard}>
                                    <div className={styles.bookingHeader}>
                                        <div className={styles.flightInfo}>
                                            <h3>{booking.flight_id}</h3>
                                            <p className={styles.route}>
                                                {booking.departure_airport.iata} → {booking.arrival_airport.iata}
                                            </p>
                                            <p className={styles.routeDetails}>
                                                {booking.departure_airport.city} → {booking.arrival_airport.city}
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
                                            <span>{booking.departure_date}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.time')}:
                                            </span>
                                            <span>{booking.departure_time}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.passenger')}:
                                            </span>
                                            <span>{booking.passenger_name}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.airline')}:
                                            </span>
                                            <span>{booking.airline}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.aircraft')}:
                                            </span>
                                            <span>{booking.aircraft}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.duration')}:
                                            </span>
                                            <span>{booking.duration}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.label}>
                                                {t('bookings.price')}:
                                            </span>
                                            <span>${booking.price}</span>
                                        </div>
                                    </div>

                                    <div className={styles.bookingActions}>
                                        <button className={styles.btnSecondary}>
                                            {t('bookings.viewDetails')}
                                        </button>
                                        <button
                                            className={styles.btnDanger}
                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                            disabled={cancelling === booking.booking_id || booking.status === 'cancelled'}
                                        >
                                            {cancelling === booking.booking_id
                                                ? t('bookings.cancelling')
                                                : t('bookings.cancel')}
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
