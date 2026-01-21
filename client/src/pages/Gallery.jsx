import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

import gallery1 from '../assets/gallery-1.png';
import gallery2 from '../assets/gallery-2.png';
import gallery3 from '../assets/gallery-3.png';
import gallery4 from '../assets/gallery-4.png';
import gallery5 from '../assets/gallery-5.png';
import gallery6 from '../assets/gallery-6.png';

const Gallery = () => {
    const { t } = useTranslation();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const demoImages = [
        { imageUrl: gallery1, alt: 'Intricate Cornrows & Dreads' },
        { imageUrl: gallery2, alt: 'Dyed Dreadlocks Styled' },
        { imageUrl: gallery3, alt: 'Long Flowing Locs' },
        { imageUrl: gallery4, alt: 'Elegant High Bun' },
        { imageUrl: gallery5, alt: 'Fresh Starter Locs' },
        { imageUrl: gallery6, alt: 'Artistic Dreadlocks Motion' },
    ];

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await api.get('/api/gallery');
                if (res.data.length > 0) {
                    setImages(res.data);
                } else {
                    setImages(demoImages);
                }
            } catch (err) {
                console.error("Failed to fetch gallery", err);
                setImages(demoImages);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="page-container container">
            <header className="page-header">
                <h1>{t('gallery.title')}</h1>
                <p>{t('gallery.subtitle')}</p>
            </header>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="gallery-grid">
                    {images.map((img, index) => (
                        <div key={img._id || index} className="gallery-item">
                            <img src={img.imageUrl || img.src} alt="Gallery item" />
                            <div className="gallery-overlay">
                                <p>Samy Locks</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;
