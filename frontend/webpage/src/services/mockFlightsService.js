// Mock database structure for USA airports
const mockDatabase = {
    states: [
        { state_id: 1, name: 'California', code: 'CA' },
        { state_id: 2, name: 'Texas', code: 'TX' },
        { state_id: 3, name: 'Florida', code: 'FL' },
    ],

    airports: [
        // California
        { airport_id: 1, name: 'Los Angeles International', city: 'Los Angeles', state_id: 1, iata: 'LAX' },
        { airport_id: 2, name: 'San Francisco International', city: 'San Francisco', state_id: 1, iata: 'SFO' },
        { airport_id: 3, name: 'San Diego International', city: 'San Diego', state_id: 1, iata: 'SAN' },
        
        // Texas
        { airport_id: 4, name: 'Dallas/Fort Worth International', city: 'Dallas', state_id: 2, iata: 'DFW' },
        { airport_id: 5, name: 'Houston International', city: 'Houston', state_id: 2, iata: 'IAH' },
        { airport_id: 6, name: 'Austin Bergstrom International', city: 'Austin', state_id: 2, iata: 'AUS' },
        
        // Florida
        { airport_id: 7, name: 'Miami International', city: 'Miami', state_id: 3, iata: 'MIA' },
        { airport_id: 8, name: 'Orlando International', city: 'Orlando', state_id: 3, iata: 'MCO' },
        { airport_id: 9, name: 'Fort Lauderdale/Hollywood', city: 'Fort Lauderdale', state_id: 3, iata: 'FLL' },
        
    ],

    availableDates: {
        1: ['2026-01-16','2026-01-17'],
        2: ['2026-01-16','2026-01-17'],
        3: ['2026-01-16','2026-01-17'],
    },

    flights: [
        {
            flight_id: 'LOT101',
            airline: 'LOT Polish Airlines',
            departure_airport_id: 1,
            arrival_airport_id: 2,
            departure_date: '2026-01-16',
            departure_time: '10:00',
            arrival_time: '22:30',
            duration: '5h 30m',
            distance: 2475,
            aircraft: 'Boeing 787',
            price: 599,
            seats_available: 45,
        },
        {
            flight_id: 'LOT102',
            airline: 'LOT Polish Airlines',
            departure_airport_id: 1,
            arrival_airport_id: 3,
            departure_date: '2026-01-16',
            departure_time: '15:00',
            arrival_time: '04:00',
            duration: '5h 0m',
            distance: 2475,
            aircraft: 'Airbus A350',
            price: 499,
            seats_available: 120,
        },
        {
            flight_id: 'LOT201',
            airline: 'LOT Polish Airlines',
            departure_airport_id: 2,
            arrival_airport_id: 3,
            departure_date: '2026-01-16',
            departure_time: '11:00',
            arrival_time: '19:00',
            duration: '5h 0m',
            distance: 1855,
            aircraft: 'Boeing 787',
            price: 649,
            seats_available: 65,
        },
    ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getStartStatesAndAirports() {
    await delay(300);
    
    const startAirports = mockDatabase.airports.filter(a => 
        mockDatabase.availableDates[a.airport_id]
    );
    
    // Get only states that have departure airports with available dates
    const statesWithAirports = new Set(startAirports.map(a => a.state_id));
    const startStates = mockDatabase.states.filter(s => statesWithAirports.has(s.state_id));
    
    return {
        states: startStates.sort((a, b) => a.name.localeCompare(b.name)),
        airports: startAirports,
    };
}

export async function getDestinationStatesAndAirports(departureAirportId) {
    await delay(300);
    
    // Get all possible destination states and airports (excluding the departure state)
    const departureAirport = mockDatabase.airports.find(a => a.airport_id === departureAirportId);
    if (!departureAirport) {
        throw new Error(`Airport not found: ${departureAirportId}`);
    }
    
    // Get states excluding the departure state
    const destinationStates = mockDatabase.states;
    
    // Get airports excluding the departure state
    const destinationAirports = mockDatabase.airports.filter(a => a !== departureAirport);
    
    return {
        states: destinationStates.sort((a, b) => a.name.localeCompare(b.name)),
        airports: destinationAirports,
    };
}

export async function getAvailableDates(departureAirportId) {
    await delay(250);
    
    const dates = mockDatabase.availableDates[departureAirportId];
    if (!dates) {
        throw new Error(`No dates available for airport ID: ${departureAirportId}`);
    }
    return dates;
}

export async function searchFlights(departureAirportId, arrivalAirportId, departureDate) {
    await delay(400);
    
    const flights = mockDatabase.flights.filter(
        (flight) =>
            flight.departure_airport_id === departureAirportId &&
            flight.arrival_airport_id === arrivalAirportId &&
            flight.departure_date === departureDate
    );
    
    if (flights.length === 0) {
        return {
            flights: [],
            message: 'No flights found for the selected route and date',
        };
    }

    const enrichedFlights = flights.map((flight) => {
        const departureAirport = mockDatabase.airports.find((a) => a.airport_id === flight.departure_airport_id);
        const arrivalAirport = mockDatabase.airports.find((a) => a.airport_id === flight.arrival_airport_id);
        const departureState = mockDatabase.states.find((s) => s.state_id === departureAirport.state_id);
        const arrivalState = mockDatabase.states.find((s) => s.state_id === arrivalAirport.state_id);

        return {
            ...flight,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_state: departureState,
            arrival_state: arrivalState,
        };
    });

    enrichedFlights.sort((a, b) => a.price - b.price);

    return {
        flights: enrichedFlights,
        total: enrichedFlights.length,
        date: departureDate,
    };
}

export default {
    getStartStatesAndAirports,
    getDestinationStatesAndAirports,
    getAvailableDates,
    searchFlights,
};
