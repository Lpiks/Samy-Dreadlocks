import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.get('http://localhost:5000/api/appointments', {
                headers: { 'auth-token': token }
            });
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch appointments';
            setError(`Error: ${errorMessage}`);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return '#28a745';
            case 'pending': return '#ffc107';
            case 'cancelled': return '#dc3545';
            case 'completed': return '#17a2b8';
            default: return '#fff';
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('auth-token');
            await axios.patch(`http://localhost:5000/api/appointments/${id}/status`,
                { status },
                { headers: { 'auth-token': token } }
            );
            fetchAppointments(); // Refresh list
            toast.success(`Appoinment status updated to ${status}`);
        } catch (err) {
            console.error('Failed to update status', err);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div className="container" style={{ paddingTop: '5rem', textAlign: 'center', color: 'red' }}>{error}</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>Manage Appointments</h1>

            {appointments.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No appointments found.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#222', borderRadius: '10px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#111', color: 'var(--primary)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Client</th>
                                <th style={{ padding: '1rem' }}>Service</th>
                                <th style={{ padding: '1rem' }}>Date & Time</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Notes</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(apt => (
                                <tr key={apt._id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {apt.user ? (apt.user.username || 'Unknown User') : (apt.guest ? `${apt.guest.name} (Guest)` : 'User Deleted')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {apt.service ? (apt.service.name || 'Unknown Service') : 'Service Deleted'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{formatDate(apt.date)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '5px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: getStatusColor(apt.status),
                                            border: `1px solid ${getStatusColor(apt.status)}`
                                        }}>
                                            {apt.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '200px' }}>{apt.notes || '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {apt.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => updateStatus(apt._id, 'confirmed')}
                                                    style={{ backgroundColor: '#28a745', border: 'none', padding: '5px 10px', borderRadius: '5px', color: 'white' }}
                                                    title="Approve"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt._id, 'cancelled')}
                                                    style={{ backgroundColor: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '5px', color: 'white' }}
                                                    title="Decline"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                        {apt.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(apt._id, 'cancelled')}
                                                style={{ backgroundColor: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '5px', color: 'white' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;
