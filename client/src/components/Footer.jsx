import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>Samy Locks</h3>
                    <p>Professional Dreadlocks Services & Care</p>
                </div>

                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Phone: +1 234 567 890</p>
                    <p>Email: info@samylocks.com</p>
                </div>

                <div className="footer-section social">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <Instagram size={24} />
                        <Facebook size={24} />
                        <Twitter size={24} />
                    </div>
                </div>
            </div>
            <div className="copyright">
                <p>&copy; 2024 Samy Locks. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
