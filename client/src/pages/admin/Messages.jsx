import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2, Check, Mail } from 'lucide-react';
import './Messages.css';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.get('http://localhost:5000/api/messages', {
                headers: { 'auth-token': token }
            });
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch messages';
            setError(`Error: ${errorMessage}`);
            setLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            const token = localStorage.getItem('auth-token');
            await axios.delete(`http://localhost:5000/api/messages/${id}`, {
                headers: { 'auth-token': token }
            });
            setMessages(messages.filter(msg => msg._id !== id));
            toast.success('Message deleted successfully');
        } catch (err) {
            console.error('Failed to delete message', err);
            toast.error('Failed to delete message');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'responded' ? 'pending' : 'responded';
        try {
            const token = localStorage.getItem('auth-token');
            await axios.patch(`http://localhost:5000/api/messages/${id}/status`,
                { status: newStatus },
                { headers: { 'auth-token': token } }
            );

            setMessages(messages.map(msg =>
                msg._id === id ? { ...msg, status: newStatus } : msg
            ));

            if (newStatus === 'responded') {
                toast.success('Marked as responded');
            } else {
                toast.success('Marked as pending');
            }
        } catch (err) {
            console.error('Failed to update status', err);
            toast.error('Failed to update status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="container admin-container">
            <h1 className="page-title">Contact Messages</h1>

            {messages.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No messages found.</p>
            ) : (
                <div className="table-container">
                    <table className="messages-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg._id} className={msg.status === 'responded' ? 'row-responded' : ''}>
                                    <td data-label="Date">{formatDate(msg.date)}</td>
                                    <td data-label="Status">
                                        <span className={`status-badge status-${msg.status || 'pending'}`}>
                                            {msg.status || 'pending'}
                                        </span>
                                    </td>
                                    <td data-label="Name">{msg.name}</td>
                                    <td data-label="Phone">{msg.phone}</td>
                                    <td data-label="Subject">{msg.subject}</td>
                                    <td data-label="Message" className="message-content-cell" title={msg.message}>
                                        {msg.message}
                                    </td>
                                    <td data-label="Actions">
                                        <div className="message-actions">
                                            <button
                                                onClick={() => toggleStatus(msg._id, msg.status || 'pending')}
                                                className={`btn-check ${msg.status === 'responded' ? 'active' : ''}`}
                                                title={msg.status === 'responded' ? "Mark as Pending" : "Mark as Responded"}
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(msg._id)}
                                                className="btn-delete"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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

export default AdminMessages;
