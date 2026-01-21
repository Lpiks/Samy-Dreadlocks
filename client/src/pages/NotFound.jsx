import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{
                fontSize: '6rem',
                fontWeight: 'bold',
                color: 'var(--primary-color)',
                marginBottom: '1rem',
                lineHeight: 1
            }}>404</h1>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: '#333'
            }}>Page Not Found</h2>
            <p style={{
                fontSize: '1.2rem',
                color: '#666',
                maxWidth: '500px',
                marginBottom: '2rem'
            }}>
                Oops! The page you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Home size={20} />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
