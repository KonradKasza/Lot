import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FooterBar from '../components/FooterBar';
import styles from './FlightBooking.module.css';

function FlightBooking() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [flightInfo, setFlightInfo] = useState(null);

    useEffect(() => {
        const storedInfo = localStorage.getItem('searchFlightInfo');
        if (storedInfo) {
            try {
                const parsedInfo = JSON.parse(storedInfo);
                setFlightInfo(parsedInfo);
            } catch (err) {
                console.error('Error parsing flight info:', err);
                navigate('/search');
            }
        } else {
            navigate('/search');
        }
    }, [navigate]);

    const handleBookFlight = (flight) => {
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        navigate('/booking-request');
    };

    if (!flightInfo) {
        return null;
    }

    const { searchResults } = flightInfo;

    if (!searchResults || !searchResults.flights || searchResults.flights.length === 0) {
        return (
            <>
                <div className={styles.pageContainer}>
                    <div className={styles.bookingContainer}>
                        <h1>{t('booking.title')}</h1>
                        <p className={styles.noFlights}>{t('booking.noFlights')}</p>
                        <button className={styles.backButton} onClick={() => navigate('/search')}>
                            {t('booking.backToSearch')}
                        </button>
                    </div>
                </div>
                <FooterBar />
            </>
        );
    }

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.bookingContainer}>
                    <h1>{t('booking.title')}</h1>
                    <p className={styles.subtitle}>{t('booking.subtitle')}</p>

                    <div className={styles.flightsGrid}>
                        {searchResults.flights.map((flight, index) => (
                            <div key={flight.flight_id} className={styles.flightCard}>
                                    <div className={styles.flightHeader}>
                                        <h2>{t('booking.flightNumber')}: {flight.flight_id}</h2>
                                        <span className={styles.airline}>{flight.airline}</span>
                                    </div>

                                    <div className={styles.flightRoute}>
                                        <div className={styles.airport}>
                                            <span className={styles.iata}>{flight.departure_airport.iata}</span>
                                            <span className={styles.airportName}>{flight.departure_airport.name}</span>
                                            <span className={styles.city}>{flight.departure_airport.city}, {flight.departure_state.code}</span>
                                        </div>
                                        <div className={styles.arrow}>→</div>
                                        <div className={styles.airport}>
                                            <span className={styles.iata}>{flight.arrival_airport.iata}</span>
                                            <span className={styles.airportName}>{flight.arrival_airport.name}</span>
                                            <span className={styles.city}>{flight.arrival_airport.city}, {flight.arrival_state.code}</span>
                                        </div>
                                    </div>

                                    <div className={styles.flightDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.departureDate')}:</span>
                                            <span className={styles.value}>{flight.departure_date}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.departureTime')}:</span>
                                            <span className={styles.value}>{flight.departure_time}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.arrivalTime')}:</span>
                                            <span className={styles.value}>{flight.arrival_time}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.duration')}:</span>
                                            <span className={styles.value}>{flight.duration}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.distance')}:</span>
                                            <span className={styles.value}>{flight.distance} {t('booking.miles')}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.aircraft')}:</span>
                                            <span className={styles.value}>{flight.aircraft}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.seatsAvailable')}:</span>
                                            <span className={styles.value}>{flight.seats_available}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>{t('booking.price')}:</span>
                                            <span className={styles.priceValue}>${flight.price}</span>
                                        </div>
                                    </div>

                                    <button 
                                        className={styles.bookButton}
                                        onClick={() => handleBookFlight(flight)}
                                    >
                                        {t('booking.bookNow')}
                                    </button>
                                </div>
                        ))}
                    </div>

                    <button className={styles.backButton} onClick={() => navigate('/search')}>
                        {t('booking.backToSearch')}
                    </button>
                </div>
            </div>
            <FooterBar />
        </>
    );
}

export default FlightBooking;
