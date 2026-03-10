import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Appointments.css';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchAppointments();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/api/appointments');
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAppointments(sorted);
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
            await api.patch(`/api/appointments/${id}/status`, { status });
            fetchAppointments(); // Refresh list
            toast.success(`Appoinment status updated to ${status}`);
            // Dispatch event to update navbar badge immediately
            window.dispatchEvent(new Event('appointmentStatusChanged'));
        } catch (err) {
            console.error('Failed to update status', err);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="container admin-container">
            <h1 className="page-title">Manage Appointments</h1>

            {appointments.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No appointments found.</p>
            ) : (
                <div className="table-container">
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Phone</th>
                                <th>Service</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(apt => (
                                <tr key={apt._id}>
                                    <td data-label="Client Name">
                                        {/* Show name from the booking form (guest.name), fallback to username */}
                                        {apt.guest?.name || (apt.user ? apt.user.username : 'Unknown')}
                                    </td>
                                    <td data-label="Phone">
                                        {apt.guest?.phone || 'N/A'}
                                    </td>
                                    <td data-label="Service">
                                        {apt.service ? (apt.service.name || 'Unknown Service') : 'Service Deleted'}
                                    </td>
                                    <td data-label="Date & Time">
                                        {formatDate(apt.date)}
                                    </td>
                                    <td data-label="Status">
                                        <span
                                            className="status-badge"
                                            style={{
                                                color: getStatusColor(apt.status),
                                                borderColor: getStatusColor(apt.status)
                                            }}
                                        >
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td data-label="Notes">
                                        {apt.notes || '-'}
                                    </td>
                                    <td data-label="Actions">
                                        {apt.status === 'pending' && (
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => updateStatus(apt._id, 'confirmed')}
                                                    className="btn-icon btn-approve"
                                                    title="Approve"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(apt._id, 'cancelled')}
                                                    className="btn-icon btn-decline"
                                                    title="Decline"
                                                >
                                                    ✕
                                                </button>
                                            </div>
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
