import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <Router>
            <div className={`app-container ${i18n.language === 'ar' ? 'rtl' : ''}`}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/booking" element={<Booking />} />

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/appointments" element={<div className="container" style={{ padding: '5rem' }}><h1>Manage Appointments</h1></div>} />
                    <Route path="/admin/services" element={<div className="container" style={{ padding: '5rem' }}><h1>Manage Services</h1></div>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
