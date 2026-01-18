const API_BASE_URL = 'http://localhost:8080/api/public/flights';

// State code mappings for US states
const STATE_CODES = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
};

// Cache for airports data
let airportsCache = null;

/**
 * Get all airports from backend
 */
async function fetchAllAirports() {
    if (airportsCache) {
        return airportsCache;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/airports`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch airports');
        }
        
        const data = await response.json();
        airportsCache = {
            countries: data.countries || [],
            airports: (data.airports || []).map(airport => ({
                airport_id: airport.airportId,
                name: airport.airportName,
                city: airport.city,
                state: airport.state,
                country: airport.country,
                iata: airport.airportId
            }))
        };
        return airportsCache;
    } catch (error) {
        console.error('Error fetching airports:', error);
        throw error;
    }
}

/**
 * Get list of all countries with airports
 * Used by FlightSearch component
 */
export async function getCountries() {
    const data = await fetchAllAirports();
    return data.countries;
}

/**
 * Get airports in a specific country
 * Used by FlightSearch component
 */
export async function getAirportsByCountry(country) {
    const data = await fetchAllAirports();
    return data.airports.filter(a => a.country === country);
}

/**
 * Get available dates for flights from a departure airport
 * Used by FlightSearch component
 */
export async function getDatesByStartAirport(airportId) {
    try {
        const response = await fetch(`${API_BASE_URL}/dates?from=${airportId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch available dates');
        }
        
        const dates = await response.json();
        return dates;  // Returns array of date strings like ["2026-01-20", "2026-01-21"]
    } catch (error) {
        console.error('Error fetching available dates:', error);
        throw error;
    }
}

/**
 * Search for flights
 * Used by FlightSearch component
 */
export async function searchResults(departureAirportId, arrivalAirportId, departureDate) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/search?from=${departureAirportId}&to=${arrivalAirportId}&date=${departureDate}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to search flights');
        }
        
        const data = await response.json();
        
        // Transform to match frontend expected format
        return {
            flights: (data.flights || []).map(flight => ({
                flight_id: flight.flightId,
                airline: flight.airline,
                departure_airport_id: flight.departureAirportId,
                arrival_airport_id: flight.arrivalAirportId,
                departure_date: flight.departureDate,
                departure_time: flight.departureTime,
                arrival_time: flight.arrivalTime,
                duration: flight.duration,
                distance: flight.distance,
                aircraft: flight.aircraft,
                price: flight.basePrice,
                seats_available: flight.seatsAvailable,
                departure_airport: {
                    airport_id: flight.departureAirportId,
                    name: flight.departureAirportName,
                    city: flight.departureCity,
                    country: flight.departureCountry,
                    iata: flight.departureAirportId
                },
                departure_state: {
                    state_id: flight.departureState,
                    name: flight.departureState,
                    code: STATE_CODES[flight.departureState] || (flight.departureState ? flight.departureState.substring(0, 2).toUpperCase() : '')
                },
                arrival_airport: {
                    airport_id: flight.arrivalAirportId,
                    name: flight.arrivalAirportName,
                    city: flight.arrivalCity,
                    country: flight.arrivalCountry,
                    iata: flight.arrivalAirportId
                },
                arrival_state: {
                    state_id: flight.arrivalState,
                    name: flight.arrivalState,
                    code: STATE_CODES[flight.arrivalState] || (flight.arrivalState ? flight.arrivalState.substring(0, 2).toUpperCase() : '')
                }
            })),
            total: data.total,
            date: data.date,
            message: data.message
        };
    } catch (error) {
        console.error('Error searching flights:', error);
        throw error;
    }
}

/**
 * Get airports with available departure flights
 */
export async function getDepartureAirports() {
    try {
        const response = await fetch(`${API_BASE_URL}/airports/departures`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch departure airports');
        }
        
        const data = await response.json();
        
        return {
            countries: data.countries || [],
            airports: (data.airports || []).map(airport => ({
                airport_id: airport.airportId,
                name: airport.airportName,
                city: airport.city,
                state: airport.state,
                country: airport.country,
                iata: airport.airportId
            }))
        };
    } catch (error) {
        console.error('Error fetching departure airports:', error);
        throw error;
    }
}

/**
 * Get destination airports for a given departure airport
 */
export async function getDestinationAirports(departureAirportId) {
    try {
        const response = await fetch(`${API_BASE_URL}/airports/destinations?from=${departureAirportId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch destination airports');
        }
        
        const data = await response.json();
        
        return {
            countries: data.countries || [],
            airports: (data.airports || []).map(airport => ({
                airport_id: airport.airportId,
                name: airport.airportName,
                city: airport.city,
                state: airport.state,
                country: airport.country,
                iata: airport.airportId
            }))
        };
    } catch (error) {
        console.error('Error fetching destination airports:', error);
        throw error;
    }
}

/**
 * Get available dates for flights from a departure airport
 */
export async function getAvailableDates(departureAirportId) {
    return getDatesByStartAirport(departureAirportId);
}

/**
 * Search for flights (alias for searchResults)
 */
export async function searchFlights(departureAirportId, arrivalAirportId, departureDate) {
    return searchResults(departureAirportId, arrivalAirportId, departureDate);
}

/**
 * Compatibility functions to match mockFlightsService API
 */
export async function getStartStatesAndAirports() {
    const data = await getDepartureAirports();
    
    // Group airports by state
    const statesMap = new Map();
    data.airports.forEach(airport => {
        const stateName = airport.state || airport.country;
        if (!statesMap.has(stateName)) {
            statesMap.set(stateName, {
                state_id: stateName,
                name: stateName,
                code: STATE_CODES[stateName] || stateName.substring(0, 2).toUpperCase()
            });
        }
    });
    
    return {
        states: Array.from(statesMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
        airports: data.airports.map(a => ({
            ...a,
            state_id: a.state || a.country
        }))
    };
}

export async function getDestinationStatesAndAirports(departureAirportId) {
    const data = await getDestinationAirports(departureAirportId);
    
    // Group airports by state
    const statesMap = new Map();
    data.airports.forEach(airport => {
        const stateName = airport.state || airport.country;
        if (!statesMap.has(stateName)) {
            statesMap.set(stateName, {
                state_id: stateName,
                name: stateName,
                code: STATE_CODES[stateName] || stateName.substring(0, 2).toUpperCase()
            });
        }
    });
    
    return {
        states: Array.from(statesMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
        airports: data.airports.map(a => ({
            ...a,
            state_id: a.state || a.country
        }))
    };
}

export default {
    getCountries,
    getAirportsByCountry,
    getDatesByStartAirport,
    searchResults,
    getDepartureAirports,
    getDestinationAirports,
    getAvailableDates,
    searchFlights,
    getStartStatesAndAirports,
    getDestinationStatesAndAirports
};
