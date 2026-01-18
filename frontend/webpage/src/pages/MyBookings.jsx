import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import styles from './MyBookings.module.css';
import { bookingsService } from '../services/bookingsService';

function MyBookings() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Fetch bookings on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        fetchBookings();
    }, [navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingsService.getMyBookings();
            // Transform backend response to match the expected format
            const transformedBookings = response.map(booking => ({
                booking_id: booking.reservationId,
                flight_id: booking.flightNumber || booking.flightId,
                departure_airport: {
                    iata: booking.departureAirportId,
                    city: booking.departureCity
                },
                arrival_airport: {
                    iata: booking.arrivalAirportId,
                    city: booking.arrivalCity
                },
                departure_date: booking.flightDate,
                departure_time: booking.departureTime,
                passenger_name: booking.passengerName || 'Passenger',
                passenger_email: booking.passengerEmail || '',
                passenger_phone: booking.passengerPhone || '',
                airline: 'LOT Polish Airlines',
                aircraft: 'Boeing 737',
                duration: calculateDuration(booking.departureTime, booking.arrivalTime),
                price: booking.totalPrice,
                status: booking.reservationStatus?.toLowerCase() || 'confirmed',
                reservation_code: booking.reservationCode,
                seat: booking.seat,
                ticket_number: booking.ticketNumber
            }));
            setBookings(transformedBookings);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            if (err.message.includes('401') || err.message.includes('authenticated')) {
                navigate('/login');
            } else {
                setError(t('bookings.loadError'));
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (departure, arrival) => {
        if (!departure || !arrival) return 'N/A';
        try {
            const [depH, depM] = departure.split(':').map(Number);
            const [arrH, arrM] = arrival.split(':').map(Number);
            let totalMinutes = (arrH * 60 + arrM) - (depH * 60 + depM);
            if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight flights
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
        } catch {
            return 'N/A';
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm(t('bookings.confirmCancel'))) {
            return;
        }

        setCancelling(bookingId);

        try {
            await bookingsService.cancelBooking(bookingId);
            // Update local state
            setBookings((prev) =>
                prev.map((b) =>
                    b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
                )
            );
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError(t('bookings.cancelError'));
        } finally {
            setCancelling(null);
        }
    };

    const openBoardingPass = (booking) => {
        setSelectedBooking(booking);
    };

    const closeBoardingPass = () => {
        setSelectedBooking(null);
    };

    const generateQRCodeUrl = (booking) => {
        const data = `LOT-${booking.reservation_code}-${booking.flight_id}-${booking.seat}-${booking.passenger_name}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
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
                                        {booking.passenger_email && (
                                            <div className={styles.detailItem}>
                                                <span className={styles.label}>
                                                    {t('bookings.email')}:
                                                </span>
                                                <span>{booking.passenger_email}</span>
                                            </div>
                                        )}
                                        {booking.passenger_phone && (
                                            <div className={styles.detailItem}>
                                                <span className={styles.label}>
                                                    {t('bookings.phone')}:
                                                </span>
                                                <span>{booking.passenger_phone}</span>
                                            </div>
                                        )}
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
                                        <button 
                                            className={styles.btnSecondary}
                                            onClick={() => openBoardingPass(booking)}
                                            disabled={booking.status === 'cancelled'}
                                        >
                                            {t('bookings.viewBoardingPass')}
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

                {/* Boarding Pass Modal */}
                {selectedBooking && (
                    <div className={styles.modalOverlay} onClick={closeBoardingPass}>
                        <div className={styles.boardingPassModal} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeButton} onClick={closeBoardingPass}>×</button>
                            
                            <div className={styles.boardingPass}>
                                <div className={styles.boardingPassHeader}>
                                    <h2>LOT Polish Airlines</h2>
                                    <span className={styles.boardingPassLabel}>{t('bookings.boardingPass')}</span>
                                </div>

                                <div className={styles.boardingPassContent}>
                                    <div className={styles.boardingPassLeft}>
                                        <div className={styles.boardingPassRow}>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.passenger')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.passenger_name}</span>
                                            </div>
                                        </div>

                                        <div className={styles.boardingPassRow}>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.from')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.departure_airport.iata}</span>
                                                <span className={styles.fieldSubValue}>{selectedBooking.departure_airport.city}</span>
                                            </div>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.to')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.arrival_airport.iata}</span>
                                                <span className={styles.fieldSubValue}>{selectedBooking.arrival_airport.city}</span>
                                            </div>
                                        </div>

                                        <div className={styles.boardingPassRow}>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.flight')}</span>
                                                <span className={styles.fieldValue}>LO {selectedBooking.flight_id}</span>
                                            </div>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.date')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.departure_date}</span>
                                            </div>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.time')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.departure_time}</span>
                                            </div>
                                        </div>

                                        <div className={styles.boardingPassRow}>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.seatLabel')}</span>
                                                <span className={styles.fieldValueLarge}>{selectedBooking.seat}</span>
                                            </div>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.gate')}</span>
                                                <span className={styles.fieldValueLarge}>A12</span>
                                            </div>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.boarding')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.departure_time}</span>
                                            </div>
                                        </div>

                                        <div className={styles.boardingPassRow}>
                                            <div className={styles.boardingPassField}>
                                                <span className={styles.fieldLabel}>{t('bookings.confirmationCode')}</span>
                                                <span className={styles.fieldValue}>{selectedBooking.reservation_code}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.boardingPassRight}>
                                        <img 
                                            src={generateQRCodeUrl(selectedBooking)} 
                                            alt="Boarding Pass QR Code"
                                            className={styles.qrCode}
                                        />
                                        <span className={styles.qrLabel}>{t('bookings.scanQR')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;
