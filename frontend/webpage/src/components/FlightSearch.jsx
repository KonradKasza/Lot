import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './FlightSearch.module.css';

// Placeholder do testowania, todo: połączyć to z bazą danych
const COUNTRIES_DATA = {
    en: {
        'Poland': ['Warsaw (WAW)', 'Krakow (KRK)', 'Wroclaw (WRO)', 'Gdansk (GDN)', 'Poznan (POZ)'],
        'United Kingdom': ['London (LHR)', 'Manchester (MAN)', 'Birmingham (BHX)', 'Edinburgh (EDI)', 'Glasgow (GLA)'],
        'Germany': ['Berlin (BER)', 'Munich (MUC)', 'Frankfurt (FRA)', 'Cologne (CGN)', 'Hamburg (HAM)'],
        'France': ['Paris (CDG)', 'Nice (NCE)', 'Lyon (LYS)', 'Marseille (MRS)', 'Toulouse (TLS)'],
        'Italy': ['Rome (FCO)', 'Milan (MXP)', 'Venice (VCE)', 'Florence (FLR)', 'Naples (NAP)'],
        'Spain': ['Madrid (MAD)', 'Barcelona (BCN)', 'Malaga (AGP)', 'Valencia (VLC)', 'Seville (SVQ)'],
        'Netherlands': ['Amsterdam (AMS)', 'Rotterdam (RTM)', 'Eindhoven (EIN)', 'Groningen (GRQ)'],
    },
    pl: {
        'Polska': ['Warszawa (WAW)', 'Kraków (KRK)', 'Wrocław (WRO)', 'Gdańsk (GDN)', 'Poznań (POZ)'],
        'Wielka Brytania': ['Londyn (LHR)', 'Manchester (MAN)', 'Birmingham (BHX)', 'Edynburg (EDI)', 'Glasgow (GLA)'],
        'Niemcy': ['Berlin (BER)', 'Monachium (MUC)', 'Frankfurt (FRA)', 'Kolonia (CGN)', 'Hamburg (HAM)'],
        'Francja': ['Paryż (CDG)', 'Nicea (NCE)', 'Lyon (LYS)', 'Marsylia (MRS)', 'Tuluza (TLS)'],
        'Włochy': ['Rzym (FCO)', 'Mediolan (MXP)', 'Wenecja (VCE)', 'Florencja (FLR)', 'Neapol (NAP)'],
        'Hiszpania': ['Madryt (MAD)', 'Barcelona (BCN)', 'Málaga (AGP)', 'Walencja (VLC)', 'Sewilla (SVQ)'],
        'Holandia': ['Amsterdam (AMS)', 'Rotterdam (RTM)', 'Eindhoven (EIN)', 'Groningen (GRQ)'],
    }
};

function FlightSearch() {
    const { t, i18n } = useTranslation();
    const [tripType, setTripType] = useState('roundtrip');
    const [departureCountry, setDepartureCountry] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const countryData = i18n.language === 'pl' ? COUNTRIES_DATA.pl : COUNTRIES_DATA.en;
    const countries = Object.keys(countryData).sort();
    const departureCities = departureCountry ? countryData[departureCountry] : [];
    const arrivalCities = arrivalCountry ? countryData[arrivalCountry] : [];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!departureCity || !arrivalCity || !departureDate) {
            alert(t('search.errors.requiredFields'));
            return;
        }
        console.log({
            tripType,
            departureCity,
            arrivalCity,
            departureDate,
            returnDate: tripType === 'roundtrip' ? returnDate : null,
        });
        // TODO: wyszukiwanie z tymi danymi
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
                                setDepartureCountry(e.target.value);
                                setDepartureCity('');
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
                            onChange={(e) => setDepartureCity(e.target.value)}
                            disabled={!departureCountry}
                            className={styles.select}
                        >
                            <option value="">{t('search.selectCity')}</option>
                            {departureCities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.arrivalCountry')}</label>
                        <select
                            value={arrivalCountry}
                            onChange={(e) => {
                                setArrivalCountry(e.target.value);
                                setArrivalCity('');
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
                            {arrivalCities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>{t('search.departureDate')}</label>
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className={styles.input}
                            required
                        />
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
