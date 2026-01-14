import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, List, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ appointments: 0, services: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            navigate('/admin/login');
        } else {
            // Mock Stats for now, or fetch real stats
            setStats({ appointments: 12, services: 5 });
        }
    }, [navigate]);

    return (
        <div className="container page-container">
            <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Admin Dashboard</h1>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div className="stat-card" style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Calendar size={40} color="var(--primary)" />
                    <div>
                        <h3>Appointments</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.appointments}</p>
                    </div>
                </div>

                <div className="stat-card" style={{ background: '#2a2a2a', padding: '1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <List size={40} color="var(--primary)" />
                    <div>
                        <h3>Services</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.services}</p>
                    </div>
                </div>
            </div>

            <div className="admin-actions" style={{ marginTop: '3rem' }}>
                <h2>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-primary" onClick={() => navigate('/admin/appointments')}>Manage Appointments</button>
                    <button className="btn-primary" onClick={() => navigate('/admin/services')}>Manage Services</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
