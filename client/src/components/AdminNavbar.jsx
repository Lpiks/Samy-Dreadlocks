import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pendingCount, setPendingCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

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

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/pending-count`, {
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
        navigate(`${ADMIN_PATH}/login`);
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="admin-navbar">
            <div className="admin-nav-header">
                <div className="admin-logo">
                    <Link to={`${ADMIN_PATH}/dashboard`} className="logo-link" onClick={closeMenu}>
                        Samy Locks <span>Admin</span>
                    </Link>
                </div>
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>
            <div className={`admin-nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to={`${ADMIN_PATH}/dashboard`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/dashboard`)}`} onClick={closeMenu}>Dashboard</Link>
                <Link to={`${ADMIN_PATH}/appointments`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/appointments`)}`} onClick={closeMenu}>
                    Appointments
                    {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
                </Link>
                <Link to={`${ADMIN_PATH}/services`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/services`)}`} onClick={closeMenu}>Services</Link>
                <Link to={`${ADMIN_PATH}/products`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/products`)}`} onClick={closeMenu}>Products</Link>
                <Link to={`${ADMIN_PATH}/gallery`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/gallery`)}`} onClick={closeMenu}>Gallery</Link>
                <Link to={`${ADMIN_PATH}/messages`} className={`admin-nav-link ${isActive(`${ADMIN_PATH}/messages`)}`} onClick={closeMenu}>Messages</Link>
                <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
