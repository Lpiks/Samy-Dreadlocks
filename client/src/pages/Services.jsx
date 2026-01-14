import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Clock, Tag } from 'lucide-react';

const Services = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback data if API is empty (for demo "wow" factor)
    const demoServices = [
        { _id: '1', name: 'Traditional Locs', description: 'Classic starter locs using comb coil or palm roll method.', price: 150, duration: '3-4 hours', imageUrl: 'https://images.unsplash.com/photo-1519699047748-40baea614fee?auto=format&fit=crop&q=80' },
        { _id: '2', name: 'Loc Retwist', description: 'Clean up new growth and maintain neat parts.', price: 85, duration: '2 hours', imageUrl: 'https://images.unsplash.com/photo-1631737487185-513d2588c599?auto=format&fit=crop&q=80' },
        { _id: '3', name: 'Interlocking', description: 'Maintenance method using a tool for longer lasting results.', price: 120, duration: '3 hours', imageUrl: 'https://images.unsplash.com/photo-1582095133179-bfd08d2c9ccf?auto=format&fit=crop&q=80' },
        { _id: '4', name: 'Loc Extensions', description: 'Instant length using 100% human hair.', price: 500, duration: '6-8 hours', imageUrl: 'https://images.unsplash.com/photo-1595181270273-0f49c5409a45?auto=format&fit=crop&q=80' },
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/services');
                if (res.data.length > 0) {
                    setServices(res.data);
                } else {
                    setServices(demoServices);
                }
            } catch (err) {
                console.error("Failed to fetch services, using demo data", err);
                setServices(demoServices);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="page-container container">
            <header className="page-header">
                <h1>{t('services.title')}</h1>
                <p>{t('services.subtitle')}</p>
            </header>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service._id} className="service-card">
                            <div className="service-image" style={{ backgroundImage: `url(${service.imageUrl})` }}></div>
                            <div className="service-info">
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <div className="service-meta">
                                    <span><Tag size={16} /> ${service.price}</span>
                                    <span><Clock size={16} /> {service.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Services;
