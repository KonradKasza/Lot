import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import { bookingsService } from '../services/bookingsService';
import styles from './BookingRequest.module.css';

function BookingRequest() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [formData, setFormData] = useState({
        passenger_name: '',
        passenger_email: '',
        passenger_phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Get selected flight from localStorage
        const storedFlight = localStorage.getItem('selectedFlight');
        if (storedFlight) {
            try {
                const flight = JSON.parse(storedFlight);
                setSelectedFlight(flight);
            } catch (err) {
                console.error('Error parsing selected flight:', err);
                navigate('/search');
            }
        } else {
            navigate('/search');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.passenger_name || !formData.passenger_email) {
            alert(t('bookingRequest.requiredFields'));
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert(t('bookingRequest.loginRequired'));
            navigate('/login');
            return;
        }

        // Check if customer info is complete
        const customerInfoComplete = localStorage.getItem('customerInfoComplete');
        if (!customerInfoComplete) {
            alert(t('bookingRequest.customerInfoRequired'));
            navigate('/customer-info');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Prepare booking data for the backend
            const bookingData = {
                flightId: selectedFlight.flight_id,
                passengerName: formData.passenger_name,
                passengerEmail: formData.passenger_email,
                passengerPhone: formData.passenger_phone,
                seat: null, // Will be auto-assigned by backend
                luggage: 'Standard',
                fareId: 1, // Default fare
                totalPrice: selectedFlight.price || 100.00
            };

            // Call the booking service
            const response = await bookingsService.createBooking(bookingData);
            
            // Store booking confirmation
            localStorage.setItem('bookingConfirmation', JSON.stringify(response));
            
            // Navigate to confirmation page or show success message
            alert(`${t('bookingRequest.bookingConfirmed')} - ${response.reservationCode}`);
            localStorage.removeItem('selectedFlight');
            navigate('/bookings');
        } catch (err) {
            console.error('Error submitting booking:', err);
            if (err.message.includes('authenticated') || err.message.includes('401')) {
                alert(t('bookingRequest.loginRequired'));
                navigate('/login');
            } else {
                alert(t('bookingRequest.bookingFailed') + ': ' + err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!selectedFlight) {
        return null;
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.requestContainer}>
                    <h1>{t('bookingRequest.title')}</h1>
                    <p className={styles.subtitle}>{t('bookingRequest.subtitle')}</p>

                    {/* Flight Summary */}
                    <div className={styles.flightSummary}>
                        <h2>{t('bookingRequest.flightSummary')}</h2>
                        
                        <div className={styles.flightInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>{t('booking.flightNumber')}:</span>
                                <span className={styles.value}>{selectedFlight.flight_id}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>{t('bookingRequest.airline')}:</span>
                                <span className={styles.value}>{selectedFlight.airline}</span>
                            </div>
                            
                            <div className={styles.routeInfo}>
                                <div className={styles.airport}>
                                    <span className={styles.iata}>{selectedFlight.departure_airport.iata}</span>
                                    <span className={styles.airportName}>{selectedFlight.departure_airport.name}</span>
                                    <span className={styles.city}>{selectedFlight.departure_airport.city}, {selectedFlight.departure_state.code}</span>
                                </div>
                                <span className={styles.arrow}>→</span>
                                <div className={styles.airport}>
                                    <span className={styles.iata}>{selectedFlight.arrival_airport.iata}</span>
                                    <span className={styles.airportName}>{selectedFlight.arrival_airport.name}</span>
                                    <span className={styles.city}>{selectedFlight.arrival_airport.city}, {selectedFlight.arrival_state.code}</span>
                                </div>
                            </div>

                            <div className={styles.detailsGrid}>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>{t('booking.departureDate')}:</span>
                                    <span className={styles.value}>{selectedFlight.departure_date}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>{t('booking.departureTime')}:</span>
                                    <span className={styles.value}>{selectedFlight.departure_time}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>{t('booking.arrivalTime')}:</span>
                                    <span className={styles.value}>{selectedFlight.arrival_time}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>{t('booking.duration')}:</span>
                                    <span className={styles.value}>{selectedFlight.duration}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <span className={styles.label}>{t('booking.price')}:</span>
                                    <span className={styles.priceValue}>${selectedFlight.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Details Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <h2>{t('bookingRequest.passengerDetails')}</h2>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="passenger_name">{t('bookingRequest.fullName')}</label>
                            <input
                                type="text"
                                id="passenger_name"
                                name="passenger_name"
                                value={formData.passenger_name}
                                onChange={handleInputChange}
                                required
                                placeholder={t('bookingRequest.fullNamePlaceholder')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="passenger_email">{t('bookingRequest.email')}</label>
                            <input
                                type="email"
                                id="passenger_email"
                                name="passenger_email"
                                value={formData.passenger_email}
                                onChange={handleInputChange}
                                required
                                placeholder={t('bookingRequest.emailPlaceholder')}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="passenger_phone">{t('bookingRequest.phone')}</label>
                            <input
                                type="tel"
                                id="passenger_phone"
                                name="passenger_phone"
                                value={formData.passenger_phone}
                                onChange={handleInputChange}
                                placeholder={t('bookingRequest.phonePlaceholder')}
                            />
                        </div>

                        <div className={styles.formActions}>
                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('bookingRequest.submitting') : t('bookingRequest.confirmBooking')}
                            </button>
                            <button 
                                type="button" 
                                className={styles.cancelButton}
                                onClick={() => navigate('/flight-booking')}
                            >
                                {t('bookingRequest.backToFlights')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <FooterBar />
        </>
    );
}

export default BookingRequest;
