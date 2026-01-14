import React from 'react';
import { useTranslation } from 'react-i18next';

import gallery1 from '../assets/gallery-1.png';
import gallery2 from '../assets/gallery-2.png';
import gallery3 from '../assets/gallery-3.png';
import gallery4 from '../assets/gallery-4.png';
import gallery5 from '../assets/gallery-5.png';
import gallery6 from '../assets/gallery-6.png';

const Gallery = () => {
    const { t } = useTranslation();

    const images = [
        { src: gallery1, alt: 'Intricate Cornrows & Dreads' },
        { src: gallery2, alt: 'Dyed Dreadlocks Styled' },
        { src: gallery3, alt: 'Long Flowing Locs' },
        { src: gallery4, alt: 'Elegant High Bun' },
        { src: gallery5, alt: 'Fresh Starter Locs' },
        { src: gallery6, alt: 'Artistic Dreadlocks Motion' },
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
                        <img src={img.src} alt={img.alt} />
                        <div className="gallery-overlay">
                            <p>{img.alt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
