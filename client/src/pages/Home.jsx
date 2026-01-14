import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-page">
            <header className="hero">
                <div className="hero-content container">
                    <h1>Samy Locks</h1>
                    <p>Elevate your style with professional dreadlocks care.</p>
                    <Link to="/booking" className="btn-primary">Book an Appointment</Link>
                </div>
            </header>

            <section className="features container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>Why Choose Us?</h2>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>Expert Stylists</h3>
                        <p>Years of experience in all dreadlock styles and maintenance.</p>
                    </div>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>Premium Products</h3>
                        <p>We use only the best organic products for your hair health.</p>
                    </div>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>Relaxing Vibe</h3>
                        <p>Enjoy a comfortable and artistic atmosphere.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
