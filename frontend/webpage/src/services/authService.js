const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Login failed');
        }

        return await response.text();
    },

    register: async (username, email, password) => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Registration failed');
        }

        return await response.json();
    },

    logout: () => {
        localStorage.removeItem('authToken');
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
    }
};
