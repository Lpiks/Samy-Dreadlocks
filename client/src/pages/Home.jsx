import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import heroImage from '../assets/hero-main.png';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="home-page">
            <header className="hero">
                <div className="hero-container container">
                    <div className="hero-content">
                        <h1>{t('home.heroTitle')}</h1>
                        <p>{t('home.heroSubtitle')}</p>
                        <Link to="/booking" className="btn-primary">{t('home.heroBtn')}</Link>
                    </div>
                    <div className="hero-image">
                        <img src={heroImage} alt="Professional Dreadlocks Styling" />
                    </div>
                </div>
            </header>

            <section className="features container">
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>{t('home.whyChooseUs')}</h2>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>{t('home.expertStylists')}</h3>
                        <p>{t('home.expertStylistsDesc')}</p>
                    </div>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>{t('home.premiumProducts')}</h3>
                        <p>{t('home.premiumProductsDesc')}</p>
                    </div>
                    <div className="feature-card" style={{ background: '#222', padding: '2rem', borderRadius: '10px', flex: '1 1 300px' }}>
                        <h3>{t('home.relaxingVibe')}</h3>
                        <p>{t('home.relaxingVibeDesc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
