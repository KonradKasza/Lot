import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './FlightSearchPage.module.css';
import FooterBar from '../components/FooterBar';
import {
    getStartStatesAndAirports,
    getDestinationStatesAndAirports,
    getAvailableDates,
    searchFlights,
} from '../services/flightsService';

function FlightSearchPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    // Departure
    const [departureState, setDepartureState] = useState('');
    const [departureAirport, setDepartureAirport] = useState('');
    
    // Arrival
    const [arrivalState, setArrivalState] = useState('');
    const [arrivalAirport, setArrivalAirport] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    
    // Data from API
    const [startStates, setStartStates] = useState([]);
    const [startAirports, setStartAirports] = useState([]);
    const [destinationStates, setDestinationStates] = useState([]);
    const [destinationAirports, setDestinationAirports] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
    const [isLoadingDates, setIsLoadingDates] = useState(false);

    // Load initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getStartStatesAndAirports();
                setStartStates(data.states);
                setStartAirports(data.airports);
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };
        fetchInitialData();
    }, []);

    // Handle departure state selection
    const handleDepartureStateChange = async (e) => {
        const stateId = e.target.value;
        setDepartureState(stateId);
        setDepartureAirport('');
        setDestinationStates([]);
        setDestinationAirports([]);
        setArrivalState('');
        setArrivalAirport('');
        setAvailableDates([]);
        setDepartureDate('');
    };

    // Handle departure airport selection
    const handleDepartureAirportChange = async (e) => {
        const airportId = e.target.value;  // Keep as string (airport code like "LAX")
        setDepartureAirport(airportId);
        setArrivalState('');
        setArrivalAirport('');
        setAvailableDates([]);
        setDepartureDate('');
        
        setIsLoadingDestinations(true);
        try {
            const data = await getDestinationStatesAndAirports(airportId);
            setDestinationStates(data.states);
            setDestinationAirports(data.airports);
        } catch (err) {
            console.error('Error fetching destination data:', err);
            setDestinationStates([]);
            setDestinationAirports([]);
        } finally {
            setIsLoadingDestinations(false);
        }
    };

    // Handle arrival state selection
    const handleArrivalStateChange = (e) => {
        setArrivalState(e.target.value);
        setArrivalAirport('');
        setAvailableDates([]);
        setDepartureDate('');
    };

    // Handle arrival airport selection
    const handleArrivalAirportChange = async (e) => {
        const airportId = e.target.value;  // Keep as string (airport code like "JFK")
        setArrivalAirport(airportId);
        setAvailableDates([]);
        setDepartureDate('');
        
        if (!airportId) return;
        
        setIsLoadingDates(true);
        try {
            // Get dates for the specific route (departure -> arrival)
            const dates = await getAvailableDates(departureAirport, airportId);
            setAvailableDates(dates);
        } catch (err) {
            console.error('Error fetching dates:', err);
            setAvailableDates([]);
        } finally {
            setIsLoadingDates(false);
        }
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!departureAirport || !arrivalAirport || !departureDate) {
            alert(t('search.errors.requiredFields'));
            return;
        }

        try {
            const result = await searchFlights(departureAirport, arrivalAirport, departureDate);
            
            // Save flight info to localStorage
            localStorage.setItem('searchFlightInfo', JSON.stringify({
                departureAirportId: departureAirport,
                arrivalAirportId: arrivalAirport,
                departureDate: departureDate,
                tripType: 'oneway',
                searchResults: result,
            }));
            
            navigate('/flight-booking');
        } catch (err) {
            console.error(err);
            alert(t('search.errors.searchFailed') || 'Search failed');
        }
    };

    // Filter airports by state (state_id is a string like "California")
    const departureAirportsByState = departureState 
        ? startAirports.filter(a => a.state_id === departureState)
        : [];
    
    const arrivalAirportsByState = arrivalState
        ? destinationAirports.filter(a => a.state_id === arrivalState)
        : [];

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.searchContainer}>
                    <h2>{t('search.title')}</h2>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.searchFields}>
                            <div className={styles.fieldGroup}>
                                <label>{t('search.departureState')}</label>
                                <select
                                    value={departureState}
                                    onChange={handleDepartureStateChange}
                                    className={styles.select}
                                >
                                    <option value="">{t('search.selectState')}</option>
                                    {startStates.map((state) => (
                                        <option key={state.state_id} value={state.state_id}>
                                            {state.name} ({state.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label>{t('search.departureCity')}</label>
                                <select
                                    value={departureAirport}
                                    onChange={handleDepartureAirportChange}
                                    disabled={!departureState}
                                    className={styles.select}
                                >
                                    <option value="">{t('search.selectCity')}</option>
                                    {departureAirportsByState.map((a) => (
                                        <option key={a.airport_id} value={a.airport_id}>
                                            {a.name} ({a.iata})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label>{t('search.arrivalState')}</label>
                                <select
                                    value={arrivalState}
                                    onChange={handleArrivalStateChange}
                                    disabled={!departureAirport || isLoadingDestinations}
                                    className={styles.select}
                                >
                                    <option value="">{t('search.selectState')}</option>
                                    {destinationStates.map((state) => (
                                        <option key={state.state_id} value={state.state_id}>
                                            {state.name} ({state.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label>{t('search.arrivalCity')}</label>
                                <select
                                    value={arrivalAirport}
                                    onChange={handleArrivalAirportChange}
                                    disabled={!arrivalState || isLoadingDestinations}
                                    className={styles.select}
                                >
                                    <option value="">{t('search.selectCity')}</option>
                                    {arrivalAirportsByState.map((a) => (
                                        <option key={a.airport_id} value={a.airport_id}>
                                            {a.name} ({a.iata})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label>{t('search.departureDate')}</label>
                                <select
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    disabled={!arrivalAirport || isLoadingDates}
                                    className={styles.select}
                                >
                                    <option value="">{t('search.selectDate')}</option>
                                    {availableDates.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={styles.searchButton}>
                            {t('search.button')}
                        </button>
                    </form>
                </div>
            </div>
            <FooterBar />
        </>
    );
}

export default FlightSearchPage;
