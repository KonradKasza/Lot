import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FlightSearch.module.css';
import {
    getCountries,
    getAirportsByCountry,
    getDatesByStartAirport,
    searchResults,
} from '../services/flightsService';

function FlightSearch() {
    const { t, i18n } = useTranslation();
    const [tripType, setTripType] = useState('roundtrip');
    const [departureCountry, setDepartureCountry] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const [countries, setCountries] = useState([]);
    const [departureAirports, setDepartureAirports] = useState([]);
    const [arrivalAirports, setArrivalAirports] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getCountries();
                console.log('Dane z API (kraje):', data);
                setCountries(Array.isArray(data) ? data.sort() : []);
            } catch (err) {
                console.error('Błąd API:', err);
                setCountries([]);
            }
        };
        fetchCountries();
    }, [i18n.language]);

    const departureCities = departureAirports;
    const arrivalCities = arrivalAirports;

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!departureCity || !arrivalCity || !departureDate) {
            alert(t('search.errors.requiredFields'));
            return;
        }

        const startId = parseInt(departureCity, 10);
        const date = departureDate;

        try {
            const results = await searchResults(startId, date);
            console.log('Search results:', results);
            // TODO: forward results to parent or display them in UI
        } catch (err) {
            console.error(err);
            alert(t('search.errors.searchFailed') || 'Search failed');
        }
    };

    return (
        <div className={styles.searchContainer}>
            <h2>{t('search.title')}</h2>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                {/* Trip Type Selection */}
                <div className={styles.tripTypeSelection}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="tripType"
                            value="roundtrip"
                            checked={tripType === 'roundtrip'}
                            onChange={(e) => setTripType(e.target.value)}
                        />
                        {t('search.roundtrip')}
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="tripType"
                            value="oneway"
                            checked={tripType === 'oneway'}
                            onChange={(e) => setTripType(e.target.value)}
                        />
                        {t('search.oneWay')}
                    </label>
                </div>

                <div className={styles.searchFields}>
                    <div className={styles.fieldGroup}>
                        <label>{t('search.departureCountry')}</label>
                        <select
                            value={departureCountry}
                            onChange={(e) => {
                                const country = e.target.value;
                                setDepartureCountry(country);
                                setDepartureCity('');
                                setAvailableDates([]);
                                if (!country) {
                                    setDepartureAirports([]);
                                    return;
                                }
                                getAirportsByCountry(country)
                                    .then((data) => setDepartureAirports(Array.isArray(data) ? data : []))
                                    .catch((err) => {
                                        console.error(err);
                                        setDepartureAirports([]);
                                    });
                            }}
                            className={styles.select}
                        >
                            <option value="">{t('search.selectCountry')}</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.departureCity')}</label>
                        <select
                            value={departureCity}
                            onChange={(e) => {
                                const val = e.target.value;
                                setDepartureCity(val);
                                setAvailableDates([]);
                                setDepartureDate('');
                                if (!val) return;
                                const id = parseInt(val, 10);
                                getDatesByStartAirport(id)
                                    .then((data) => setAvailableDates(Array.isArray(data) ? data : []))
                                    .catch((err) => {
                                        console.error(err);
                                        setAvailableDates([]);
                                    });
                            }}
                            disabled={!departureCountry}
                            className={styles.select}
                        >
                            <option value="">{t('search.selectCity')}</option>
                            {departureCities.map((a) => (
                                <option key={a.airport_id} value={a.airport_id}>
                                    {a.name} ({a.city})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.arrivalCountry')}</label>
                        <select
                            value={arrivalCountry}
                            onChange={(e) => {
                                const country = e.target.value;
                                setArrivalCountry(country);
                                setArrivalCity('');
                                if (!country) {
                                    setArrivalAirports([]);
                                    return;
                                }
                                getAirportsByCountry(country)
                                    .then((data) => setArrivalAirports(Array.isArray(data) ? data : []))
                                    .catch((err) => {
                                        console.error(err);
                                        setArrivalAirports([]);
                                    });
                            }}
                            className={styles.select}
                        >
                            <option value="">{t('search.selectCountry')}</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.arrivalCity')}</label>
                        <select
                            value={arrivalCity}
                            onChange={(e) => setArrivalCity(e.target.value)}
                            disabled={!arrivalCountry}
                            className={styles.select}
                        >
                            <option value="">{t('search.selectCity')}</option>
                            {arrivalCities.map((a) => (
                                <option key={a.airport_id} value={a.airport_id}>
                                    {a.name} ({a.city})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.departureDate')}</label>
                        <select
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">{t('search.selectDate')}</option>
                            {availableDates.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    {tripType === 'roundtrip' && (
                        <div className={styles.fieldGroup}>
                            <label>{t('search.returnDate')}</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className={styles.searchButton}>
                    {t('search.button')}
                </button>
            </form>
        </div>
    );
}

export default FlightSearch;
