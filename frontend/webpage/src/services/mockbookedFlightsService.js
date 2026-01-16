// Mock booked flights service

const mockDatabase = {
    states: [
        { state_id: 1, name: 'California', code: 'CA' },
        { state_id: 2, name: 'Texas', code: 'TX' },
        { state_id: 3, name: 'Florida', code: 'FL' },
    ],
    airports: [
        { airport_id: 1, name: 'Los Angeles International', city: 'Los Angeles', state_id: 1, iata: 'LAX' },
        { airport_id: 2, name: 'San Francisco International', city: 'San Francisco', state_id: 1, iata: 'SFO' },
        { airport_id: 3, name: 'San Diego International', city: 'San Diego', state_id: 1, iata: 'SAN' },
        { airport_id: 4, name: 'Dallas/Fort Worth International', city: 'Dallas', state_id: 2, iata: 'DFW' },
        { airport_id: 5, name: 'Houston International', city: 'Houston', state_id: 2, iata: 'IAH' },
        { airport_id: 6, name: 'Austin Bergstrom International', city: 'Austin', state_id: 2, iata: 'AUS' },
        { airport_id: 7, name: 'Miami International', city: 'Miami', state_id: 3, iata: 'MIA' },
        { airport_id: 8, name: 'Orlando International', city: 'Orlando', state_id: 3, iata: 'MCO' },
        { airport_id: 9, name: 'Fort Lauderdale/Hollywood', city: 'Fort Lauderdale', state_id: 3, iata: 'FLL' },
    ],
    bookings: {
        'admin@admin.com': [
            {
                booking_id: 'BK123456789',
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
                passenger_name: 'John Doe',
                passenger_email: 'user@example.com',
                status: 'confirmed',
                booking_date: '2026-01-15',
            },
            {
                booking_id: 'BK987654321',
                flight_id: 'LOT201',
                airline: 'LOT Polish Airlines',
                departure_airport_id: 2,
                arrival_airport_id: 3,
                departure_date: '2026-02-01',
                departure_time: '11:00',
                arrival_time: '19:00',
                duration: '5h 0m',
                distance: 1855,
                aircraft: 'Boeing 787',
                price: 649,
                passenger_name: 'John Doe',
                passenger_email: 'user@example.com',
                status: 'pending',
                booking_date: '2026-01-10',
            },
        ],
        'test@example.com': [
            {
                booking_id: 'BK111222333',
                flight_id: 'LOT102',
                airline: 'LOT Polish Airlines',
                departure_airport_id: 1,
                arrival_airport_id: 3,
                departure_date: '2026-01-20',
                departure_time: '15:00',
                arrival_time: '04:00',
                duration: '5h 0m',
                distance: 2475,
                aircraft: 'Airbus A350',
                price: 499,
                passenger_name: 'Jane Smith',
                passenger_email: 'test@example.com',
                status: 'confirmed',
                booking_date: '2026-01-14',
            },
        ],
    },
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all bookings for a user by email
 * @param {string} userEmail - User's email address
 * @returns {Promise<Object>} List of bookings with enriched flight data
 */
export async function getUserBookings(userEmail) {
    await delay(400);

    const userBookings = mockDatabase.bookings[userEmail] || [];

    if (userBookings.length === 0) {
        return {
            success: true,
            bookings: [],
            message: 'No bookings found',
        };
    }

    // Enrich bookings with airport and state information
    const enrichedBookings = userBookings.map((booking) => {
        const departureAirport = mockDatabase.airports.find(
            (a) => a.airport_id === booking.departure_airport_id
        );
        const arrivalAirport = mockDatabase.airports.find(
            (a) => a.airport_id === booking.arrival_airport_id
        );
        const departureState = mockDatabase.states.find(
            (s) => s.state_id === departureAirport.state_id
        );
        const arrivalState = mockDatabase.states.find(
            (s) => s.state_id === arrivalAirport.state_id
        );

        return {
            ...booking,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_state: departureState,
            arrival_state: arrivalState,
        };
    });

    // Sort by departure date descending (most recent first)
    enrichedBookings.sort(
        (a, b) => new Date(b.departure_date) - new Date(a.departure_date)
    );

    return {
        success: true,
        bookings: enrichedBookings,
        message: 'Bookings retrieved successfully',
    };
}

/**
 * Get a specific booking by booking ID
 * @param {string} bookingId - The booking ID
 * @param {string} userEmail - User's email address (for verification)
 * @returns {Promise<Object>} Booking details
 */
export async function getBookingDetails(bookingId, userEmail) {
    await delay(300);

    const userBookings = mockDatabase.bookings[userEmail] || [];
    const booking = userBookings.find((b) => b.booking_id === bookingId);

    if (!booking) {
        return {
            success: false,
            error: 'Booking not found',
        };
    }

    const departureAirport = mockDatabase.airports.find(
        (a) => a.airport_id === booking.departure_airport_id
    );
    const arrivalAirport = mockDatabase.airports.find(
        (a) => a.airport_id === booking.arrival_airport_id
    );
    const departureState = mockDatabase.states.find(
        (s) => s.state_id === departureAirport.state_id
    );
    const arrivalState = mockDatabase.states.find(
        (s) => s.state_id === arrivalAirport.state_id
    );

    return {
        success: true,
        booking: {
            ...booking,
            departure_airport: departureAirport,
            arrival_airport: arrivalAirport,
            departure_state: departureState,
            arrival_state: arrivalState,
        },
        message: 'Booking details retrieved successfully',
    };
}

/**
 * Cancel a booking
 * @param {string} bookingId - The booking ID to cancel
 * @param {string} userEmail - User's email address (for verification)
 * @returns {Promise<Object>} Cancellation confirmation
 */
export async function cancelBooking(bookingId, userEmail) {
    await delay(400);

    const userBookings = mockDatabase.bookings[userEmail] || [];
    const bookingIndex = userBookings.findIndex((b) => b.booking_id === bookingId);

    if (bookingIndex === -1) {
        return {
            success: false,
            error: 'Booking not found',
        };
    }

    // Update booking status to cancelled
    mockDatabase.bookings[userEmail][bookingIndex].status = 'cancelled';

    return {
        success: true,
        message: 'Booking cancelled successfully',
        booking_id: bookingId,
    };
}

export default {
    getUserBookings,
    getBookingDetails,
    cancelBooking,
};
