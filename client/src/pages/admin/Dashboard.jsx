import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, List, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ appointments: 0, services: 0, messages: 0 });
    const navigate = useNavigate();
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            navigate(`${ADMIN_PATH}/login`);
        } else {
            fetchStats(token);
        }
    }, [navigate]);

    const fetchStats = async (token) => {
        try {
            const config = { headers: { 'auth-token': token } };

            // Parallel requests for better performance
            const [apptRes, serviceRes, msgRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/appointments/pending-count`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/services`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/messages/pending-count`, config)
            ]);

            setStats({
                appointments: apptRes.data.count,
                services: serviceRes.data.length,
                messages: msgRes.data.count
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to 0 if fails, or keep loading state
        }
    };

    return (
        <div className="container admin-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <Calendar size={40} color="var(--primary)" />
                    <div className="stat-info">
                        <h3>Appointments</h3>
                        <p className="stat-number">{stats.appointments}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <List size={40} color="var(--primary)" />
                    <div className="stat-info">
                        <h3>Services</h3>
                        <p className="stat-number">{stats.services}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <MessageSquare size={40} color="var(--primary)" />
                    <div className="stat-info">
                        <h3>Messages</h3>
                        <p className="stat-number">{stats.messages}</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-container">
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/appointments`)}>Manage Appointments</button>
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/services`)}>Manage Services</button>
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/gallery`)}>Manage Gallery</button>
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/products`)}>Manage Products</button>
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/categories`)}>Manage Categories</button>
                    <button className="btn-primary" onClick={() => navigate(`${ADMIN_PATH}/messages`)}>Manage Messages</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
