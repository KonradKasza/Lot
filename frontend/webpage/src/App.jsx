import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import CustomerInfo from './pages/CustomerInfo';
import FlightSearchPage from './pages/FlightSearchPage';
import FlightBooking from './pages/FlightBooking';
import BookingRequest from './pages/BookingRequest';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/customer-info" element={<CustomerInfo />} />
                    <Route path="/search" element={<FlightSearchPage />} />
                    <Route path="/flight-booking" element={<FlightBooking />} />
                    <Route path="/booking-request" element={<BookingRequest />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
