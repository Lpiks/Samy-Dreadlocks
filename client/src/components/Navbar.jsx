import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">Samy Locks</Link>

                <div className="nav-links-desktop">
                    <Link to="/">Home</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/booking" className="btn-primary">Book Now</Link>
                </div>

                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>

            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
                    <Link to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link>
                    <Link to="/booking" onClick={() => setIsOpen(false)}>Book Now</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
