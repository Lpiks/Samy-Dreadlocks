import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import heroImage from '../assets/hero-main.png';

const Home = () => {
    const { t } = useTranslation();

    return (
        <main className="home-page">
            <Helmet>
                <title>Samy Locks | Professional Dreadlocks Styling & Maintenance</title>
                <meta name="description" content="Discover premium dreadlocks services, natural hair care products, and expert styling at Samy Locks in Algeria." />
                <link rel="canonical" href="https://www.yourdomain.com/" />
            </Helmet>
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

            <section className="features-section container">
                <h2>{t('home.whyChooseUs')}</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>{t('home.expertStylists')}</h3>
                        <p>{t('home.expertStylistsDesc')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('home.premiumProducts')}</h3>
                        <p>{t('home.premiumProductsDesc')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('home.relaxingVibe')}</h3>
                        <p>{t('home.relaxingVibeDesc')}</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
