import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>Samy Locks</h3>
                    <p>{t('footer.desc')}</p>
                </div>

                <div className="footer-section">
                    <h4><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>{t('footer.contact')}</Link></h4>
                    <p>{t('footer.phone')}: +1 234 567 890</p>
                    <p>{t('footer.email')}: info@samylocks.com</p>
                </div>

                <div className="footer-section social">
                    <h4>{t('footer.followUs')}</h4>
                    <div className="social-icons">
                        <Instagram size={24} />
                        <Facebook size={24} />
                        <Twitter size={24} />
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>&copy; {new Date().getFullYear()} Dreadlocks Salon. All rights reserved.</p>

            </div>
        </footer>
    );
};

export default Footer;
