import React from 'react';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
    const { t } = useTranslation();

    const images = [
        'https://images.unsplash.com/photo-1595181270273-0f49c5409a45?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519699047748-40baea614fee?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1631737487185-513d2588c599?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582095133179-bfd08d2c9ccf?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1521590832169-d3c16ccb2bf7?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500517484804-b5b63fc49488?auto=format&fit=crop&q=80',
    ];

    return (
        <div className="page-container container">
            <header className="page-header">
                <h1>{t('gallery.title')}</h1>
                <p>{t('gallery.subtitle')}</p>
            </header>

            <div className="gallery-grid">
                {images.map((img, index) => (
                    <div key={index} className="gallery-item">
                        <img src={img} alt={`Gallery ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
