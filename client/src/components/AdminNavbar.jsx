import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="admin-navbar">
            <div className="admin-logo">
                <Link to="/admin/dashboard" className="logo-link">
                    Samy Locks <span>Admin</span>
                </Link>
            </div>
            <div className="admin-nav-links">
                <Link to="/admin/dashboard" className={`admin-nav-link ${isActive('/admin/dashboard')}`}>Dashboard</Link>
                <Link to="/admin/appointments" className={`admin-nav-link ${isActive('/admin/appointments')}`}>Appointments</Link>
                <Link to="/admin/services" className={`admin-nav-link ${isActive('/admin/services')}`}>Services</Link>
                <Link to="/admin/gallery" className={`admin-nav-link ${isActive('/admin/gallery')}`}>Gallery</Link>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
