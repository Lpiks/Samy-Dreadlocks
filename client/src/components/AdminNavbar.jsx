import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pendingCount, setPendingCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const token = localStorage.getItem('auth-token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/appointments/pending-count', {
                    headers: { 'auth-token': token }
                });
                const data = await response.json();
                if (data.count) setPendingCount(data.count);
            } catch (err) {
                console.error("Error fetching pending count:", err);
            }
        };

        fetchPendingCount();
        // Poll every 30 seconds to keep it updated
        const interval = setInterval(fetchPendingCount, 30000);

        // Listen for updates from other components
        window.addEventListener('appointmentStatusChanged', fetchPendingCount);

        return () => {
            clearInterval(interval);
            window.removeEventListener('appointmentStatusChanged', fetchPendingCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-header">
                <div className="admin-logo">
                    <Link to="/admin/dashboard" className="logo-link" onClick={closeMenu}>
                        Samy Locks <span>Admin</span>
                    </Link>
                </div>
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>
            <div className={`admin-nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/admin/dashboard" className={`admin-nav-link ${isActive('/admin/dashboard')}`} onClick={closeMenu}>Dashboard</Link>
                <Link to="/admin/appointments" className={`admin-nav-link ${isActive('/admin/appointments')}`} onClick={closeMenu}>
                    Appointments
                    {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
                </Link>
                <Link to="/admin/services" className={`admin-nav-link ${isActive('/admin/services')}`} onClick={closeMenu}>Services</Link>
                <Link to="/admin/gallery" className={`admin-nav-link ${isActive('/admin/gallery')}`} onClick={closeMenu}>Gallery</Link>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
