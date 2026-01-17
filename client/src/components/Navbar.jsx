import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">Samy Locks</Link>

                <div className="nav-links-desktop">
                    <Link to="/">{t('navbar.home')}</Link>
                    <Link to="/services">{t('navbar.services')}</Link>
                    <Link to="/gallery">{t('navbar.gallery')}</Link>
                    <Link to="/contact">{t('navbar.contact')}</Link>
                    <Link to="/booking" className="btn-primary">{t('navbar.bookBtn')}</Link>

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
