import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { Clock, Tag } from 'lucide-react';


import serviceTraditional from '../assets/service-traditional.png';
import serviceRetwist from '../assets/service-retwist.png';
import serviceInterlocking from '../assets/service-interlocking.png';
import serviceExtensions from '../assets/service-extensions.png';

const Services = () => {
    const { t } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fallback data if API is empty (for demo "wow" factor)
    const demoServices = [
        { _id: '1', name: 'Traditional Locs', description: 'Classic starter locs using comb coil or palm roll method.', price: 150, duration: '3-4 hours', imageUrl: serviceTraditional },
        { _id: '2', name: 'Loc Retwist', description: 'Clean up new growth and maintain neat parts.', price: 85, duration: '2 hours', imageUrl: serviceRetwist },
        { _id: '3', name: 'Interlocking', description: 'Maintenance method using a tool for longer lasting results.', price: 120, duration: '3 hours', imageUrl: serviceInterlocking },
        { _id: '4', name: 'Loc Extensions', description: 'Instant length using 100% human hair.', price: 500, duration: '6-8 hours', imageUrl: serviceExtensions },
    ];


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get('/api/services');
                if (res.data.length > 0) {
                    // Merge backend data with local high-quality images
                    const localImages = {
                        'Traditional Locs': serviceTraditional,
                        'Loc Retwist': serviceRetwist,
                        'Interlocking': serviceInterlocking,
                        'Loc Extensions': serviceExtensions
                    };

                    const updatedServices = res.data.map(service => ({
                        ...service,
                        imageUrl: localImages[service.name] || service.imageUrl
                    }));
                    setServices(updatedServices);
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
                                    <span><Tag size={16} /> {service.price} DZD</span>
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
