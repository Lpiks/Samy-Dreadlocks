import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, List, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ appointments: 0, services: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchStats(token);
        }
    }, [navigate]);

    const fetchStats = async (token) => {
        try {
            const config = { headers: { 'auth-token': token } };

            // Parallel requests for better performance
            const [apptRes, serviceRes] = await Promise.all([
                axios.get('http://localhost:5000/api/appointments/pending-count', config),
                axios.get('http://localhost:5000/api/services', config)
                // Future: Add Gallery count fetch here
            ]);

            setStats({
                appointments: apptRes.data.count,
                services: serviceRes.data.length
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
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-container">
                    <button className="btn-primary" onClick={() => navigate('/admin/appointments')}>Manage Appointments</button>
                    <button className="btn-primary" onClick={() => navigate('/admin/services')}>Manage Services</button>
                    <button className="btn-primary" onClick={() => navigate('/admin/gallery')}>Manage Gallery</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
