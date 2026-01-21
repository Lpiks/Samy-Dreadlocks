import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminPath }) => {
    const token = localStorage.getItem('auth-token');

    if (!token) {
        return <Navigate to={`${adminPath}/login`} replace />;
    }

    return children;
};

export default ProtectedRoute;
