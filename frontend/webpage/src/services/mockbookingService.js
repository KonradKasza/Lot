// Mock booking service for handling flight bookings

// Mirroring the database from mockFlightsService to ensure compatibility
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
    ]
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const calculateArrivalTime = (departureTime, duration) => {
    // Parse departure time (HH:MM)
    const [depHours, depMinutes] = departureTime.split(':').map(Number);
    
    // Parse duration (Xh Ym)
    const durationParts = duration.split(' ');
    let durHours = 0;
    let durMinutes = 0;
    
    if (durationParts.length > 0) durHours = parseInt(durationParts[0]);
    if (durationParts.length > 1) durMinutes = parseInt(durationParts[1]);
    
    let arrivalMinutes = depMinutes + durMinutes;
    let arrivalHours = depHours + durHours;
    
    if (arrivalMinutes >= 60) {
        arrivalHours += Math.floor(arrivalMinutes / 60);
        arrivalMinutes = arrivalMinutes % 60;
    }
    
    // Handle next day wraps (simple 24h format)
    arrivalHours = arrivalHours % 24;
    
    return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
};

export async function getBookingDetails(flightId) {
    await delay(300);
    
    // First try to find in mock database
    const mockFlight = mockDatabase.flights.find(f => f.flight_id === flightId);
    
    let flightData;

    if (mockFlight) {
        // Enrich data
        const departureAirport = mockDatabase.airports.find(a => a.airport_id === mockFlight.departure_airport_id);
        const arrivalAirport = mockDatabase.airports.find(a => a.airport_id === mockFlight.arrival_airport_id);
        const departureState = mockDatabase.states.find(s => s.state_id === departureAirport.state_id);
        const arrivalState = mockDatabase.states.find(s => s.state_id === arrivalAirport.state_id);

        flightData = {
            ...mockFlight,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_state: departureState,
            arrival_state: arrivalState,
            // Calculate arrival time dynamically
            arrival_time: calculateArrivalTime(mockFlight.departure_time, mockFlight.duration)
        };
    } else {
        // Fallback to localStorage if not found in mock DB (simulating passed state)
        const storedFlight = localStorage.getItem('selectedFlight');
        if (storedFlight) {
            flightData = JSON.parse(storedFlight);
            if (flightData.flight_id !== flightId) {
                 // If ID doesn't match and not in DB, we can't do much
            }
        }
    }
    
    if (!flightData) {
         throw new Error('Flight not found');
    }

    // Return the flight with all details
    return {
        success: true,
        flight: flightData,
        message: 'Booking details retrieved successfully',
    };
}

/**
 * Submit a booking request
 * @param {Object} bookingData - Booking information including passenger details
 * @returns {Promise<Object>} Booking confirmation
 */
export async function submitBookingRequest(bookingData) {
    await delay(500);
    
    // Validate required fields
    const requiredFields = ['flight_id', 'passenger_name', 'passenger_email'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
        return {
            success: false,
            error: `Missing required fields: ${missingFields.join(', ')}`,
        };
    }
    
    // Generate a mock booking confirmation
    const bookingConfirmation = {
        booking_id: `BK${Date.now()}`,
        flight_id: bookingData.flight_id,
        passenger_name: bookingData.passenger_name,
        passenger_email: bookingData.passenger_email,
        booking_date: new Date().toISOString(),
        status: 'confirmed',
        confirmation_code: generateConfirmationCode(),
    };
    
    return {
        success: true,
        booking: bookingConfirmation,
        message: 'Booking confirmed successfully',
    };
}

/**
 * Get all bookings for a user
 * @param {string} userEmail - User's email address
 * @returns {Promise<Array>} List of user bookings
 */
export async function getUserBookings(userEmail) {
    await delay(300);
    
    const mockBookings = [];
    
    return {
        success: true,
        bookings: mockBookings,
        message: 'Bookings retrieved successfully',
    };
}

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID to cancel
 * @returns {Promise<Object>} Cancellation confirmation
 */
export async function cancelBooking(bookingId) {
    await delay(400);
    
    return {
        success: true,
        booking_id: bookingId,
        message: 'Booking cancelled successfully',
    };
}

// Helper function to generate random confirmation code
function generateConfirmationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default {
    getBookingDetails,
    submitBookingRequest,
    getUserBookings,
    cancelBooking,
};
