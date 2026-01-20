import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const location = useLocation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Helper function to determine if a link is active
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    // Function to close the mobile menu
    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">Samy Locks</Link>

                <div className="nav-links-desktop">
                    <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>{t('navbar.home')}</Link>
                    <Link to="/services" className={`nav-link ${isActive('/services')}`} onClick={closeMenu}>{t('navbar.services')}</Link>
                    <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`} onClick={closeMenu}>{t('navbar.gallery')}</Link>
                    <Link to="/products" className={`nav-link ${isActive('/products')}`} onClick={closeMenu}>Products</Link>
                    <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={closeMenu}>{t('navbar.contact')}</Link>
                    <Link to="/booking" className="btn-primary" onClick={closeMenu}>{t('navbar.bookBtn')}</Link>

                    <div className="lang-switcher">
                        <button className="lang-btn">
                            <Globe size={18} />
                            <span>{i18n.language.toUpperCase()}</span>
                        </button>
                        <div className="lang-dropdown">
                            <button onClick={() => changeLanguage('en')}>EN</button>
                            <button onClick={() => changeLanguage('fr')}>FR</button>
                            <button onClick={() => changeLanguage('ar')}>AR</button>
                        </div>
                    </div>
                </div>

                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </div>
            </div>
            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setIsOpen(false)}>{t('navbar.home')}</Link>
                    <Link to="/services" onClick={() => setIsOpen(false)}>{t('navbar.services')}</Link>
                    <Link to="/gallery" onClick={() => setIsOpen(false)}>{t('navbar.gallery')}</Link>
                    <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>{t('navbar.contact')}</Link>
                    <Link to="/booking" onClick={() => setIsOpen(false)}>{t('navbar.bookBtn')}</Link>
                    <div className="mobile-lang-switcher">
                        <span onClick={() => changeLanguage('en')}>English</span>
                        <span onClick={() => changeLanguage('fr')}>Français</span>
                        <span onClick={() => changeLanguage('ar')}>العربية</span>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
