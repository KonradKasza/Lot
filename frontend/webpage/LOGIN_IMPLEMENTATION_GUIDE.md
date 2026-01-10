# Login Page Implementation Guide

## Overview
The login page is a basic implementation that handles user authentication. This guide explains the current structure and how to enhance it for production use.

## Current Implementation

### Key Files
- `src/pages/Login.jsx` - Main login component
- `src/pages/Login.module.css` - Styling

### Features Included
- Email and password input fields
- Form validation (HTML5 required attributes)
- Loading state during authentication
- Error message display
- Password forgotten and signup links
- Bilingual support (English/Polish)

## How to Enhance for Production

### 1. API Integration
Replace the dummy authentication with real API calls:

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        
        // Store JWT token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home or bookings
        navigate('/bookings');
    } catch (err) {
        setError(t('login.error'));
    } finally {
        setIsLoading(false);
    }
};
```

### 2. Form Validation
Add more robust validation:

```javascript
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

// In handleSubmit, add validation:
if (!validateEmail(email)) {
    setError(t('login.invalidEmail'));
    return;
}
if (!validatePassword(password)) {
    setError(t('login.passwordTooShort'));
    return;
}
```

### 3. Password Reset
Create a new page for password reset functionality:

```javascript
// src/pages/PasswordReset.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function PasswordReset() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await fetch('/api/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Reset failed:', err);
        }
    };

    return (
        <div className={styles.container}>
            {submitted ? (
                <p>{t('passwordReset.checkEmail')}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.email')}
                        required
                    />
                    <button type="submit">{t('passwordReset.send')}</button>
                </form>
            )}
        </div>
    );
}
```

### 4. Sign Up Page
Create a registration page:

```javascript
// src/pages/SignUp.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function SignUp() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate
        if (formData.password !== formData.confirmPassword) {
            setErrors({ password: t('signup.passwordMismatch') });
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Registration failed');
            
            // Redirect to login
            navigate('/login');
        } catch (err) {
            setErrors({ submit: t('signup.error') });
        }
    };

    return (
        // Form implementation with all fields
        <form onSubmit={handleSubmit}>
            {/* Form fields */}
        </form>
    );
}
```

### 5. Protected Routes
Create a route guard for authenticated pages:

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
    const isAuthenticated = !!localStorage.getItem('authToken');
    
    return isAuthenticated ? element : <Navigate to="/login" />;
}

// In App.jsx:
<Route 
    path="/bookings" 
    element={<ProtectedRoute element={<MyBookings />} />} 
/>
```

### 6. Authentication Context (Recommended)
Create a context for managing auth state globally:

```javascript
// src/context/AuthContext.jsx
import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            return data;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('authToken');
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### 7. Session Management
Add token refresh and auto-logout:

```javascript
// Create an auth interceptor
function setupAuthInterceptor() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token && args[1]) {
            args[1].headers = args[1].headers || {};
            args[1].headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await originalFetch(...args);
        
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        
        return response;
    };
}
```

## Translation Keys to Add

Add these to your translation files:

```json
{
    "signup": {
        "title": "Create Account",
        "firstName": "First Name",
        "lastName": "Last Name",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "button": "Sign Up",
        "passwordMismatch": "Passwords do not match",
        "error": "Registration failed"
    },
    "passwordReset": {
        "title": "Reset Password",
        "email": "Enter your email",
        "send": "Send Reset Link",
        "checkEmail": "Check your email for reset instructions"
    },
    "login": {
        "invalidEmail": "Please enter a valid email",
        "passwordTooShort": "Password must be at least 6 characters"
    }
}
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Token Storage**: Consider using HttpOnly cookies instead of localStorage
3. **Password Hashing**: Never send plain text passwords; hash on client side or server
4. **CSRF Protection**: Implement CSRF tokens for form submissions
5. **Rate Limiting**: Implement rate limiting on login attempts
6. **Two-Factor Authentication**: Consider adding 2FA for enhanced security

## Testing

```javascript
// Example test for login form
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('submits login form', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByText(/log in/i));
    
    // Assert API was called
    expect(fetchMock).toHaveBeenCalledWith('/api/login', expect.any(Object));
});
```

## Next Steps

1. Set up your backend API with `/api/login` endpoint
2. Implement JWT token handling
3. Create password reset functionality
4. Add sign-up page
5. Implement protected routes
6. Add authentication context
7. Set up proper error handling and validation
8. Add unit and integration tests
