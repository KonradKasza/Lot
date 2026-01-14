const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const bookingsService = {
    getMyBookings: async () => {
        const response = await fetch(`${API_BASE_URL}/bookings/my`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to fetch bookings');
        }

        return await response.json();
    },

    createBooking: async (bookingData) => {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to create booking');
        }

        return await response.json();
    },

    cancelBooking: async (bookingId) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to cancel booking');
        }

        return await response.json();
    }
};
