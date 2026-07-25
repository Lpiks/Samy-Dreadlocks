import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

const ProtectedRoute = ({ children, adminPath }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                await api.get('/api/user/verify');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        verifySession();
    }, []);

    if (isAuthenticated === null) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff' }}>Verifying session...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={`${adminPath}/login`} replace />;
    }

    return children;
};

export default ProtectedRoute;
