import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Orders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            navigate(`${ADMIN_PATH}/login`);
        } else {
            fetchOrders(token);
        }
    }, [navigate, ADMIN_PATH]);

    const fetchOrders = async (token) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
                headers: { 'auth-token': token }
            });
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Failed to load orders');
            setLoading(false);
        }
    };

    const updateStatus = async (e, orderId, newStatus) => {
        e.stopPropagation(); // Prevent modal opening
        try {
            const token = localStorage.getItem('auth-token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { 'auth-token': token } }
            );

            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));

            // Also update selected modal order if it matches
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }

            toast.success(`Order ${newStatus} successfully`);
        } catch (err) {
            console.error('Error updating order:', err);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="admin-loading">Loading orders...</div>;

    return (
        <div className="admin-orders-container">
            <h1 className="admin-orders-title">Manage Orders</h1>

            {orders.length === 0 ? (
                <div className="no-orders">No orders found.</div>
            ) : (
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} onClick={() => setSelectedOrder(order)} className="order-row-clickable">
                                    <td>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="customer-info">
                                            <strong>{order.customerName}</strong>
                                            <p>{order.phone}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="order-items-mini-list">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="item-badge">
                                                    {item.quantity}x {item.product?.name || 'Unknown'}
                                                </span>
                                            ))}
                                            {order.items.length > 2 && <span className="item-more">+{order.items.length - 2} more</span>}
                                        </div>
                                    </td>
                                    <td>{(order.totalAmount || 0).toFixed(2)} DZD</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.status === 'pending' && (
                                            <div className="order-actions">
                                                <button
                                                    className="btn-action btn-accept"
                                                    onClick={(e) => updateStatus(e, order._id, 'confirmed')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn-action btn-decline"
                                                    onClick={(e) => updateStatus(e, order._id, 'cancelled')}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                        <button className="btn-action btn-view" onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedOrder(order);
                                        }}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>

                        <div className="modal-header-section">
                            <h2>Order Details</h2>
                            <span className="order-id">ID: {selectedOrder._id}</span>
                            <span className={`status-badge ${selectedOrder.status} large`}>
                                {selectedOrder.status}
                            </span>
                        </div>

                        <div className="modal-grid">
                            <div className="modal-section">
                                <h3>Customer Information</h3>
                                <div className="info-group">
                                    <label>Name:</label>
                                    <p>{selectedOrder.customerName}</p>
                                </div>
                                <div className="info-group">
                                    <label>Phone:</label>
                                    <p>{selectedOrder.phone}</p>
                                </div>
                                <div className="info-group">
                                    <label>Address:</label>
                                    <p className="address-text">{selectedOrder.address}</p>
                                </div>
                                <div className="info-group">
                                    <label>Date:</label>
                                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Order Items</h3>
                                <div className="modal-items-list">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="modal-item">
                                            {item.product && (
                                                <img src={item.product.image} alt={item.product.name} />
                                            )}
                                            <div className="modal-item-details">
                                                <h4>{item.product?.name || 'Product unavailable'}</h4>
                                                <p>{item.product?.price.toFixed(2)} DZD x {item.quantity}</p>
                                            </div>
                                            <div className="modal-item-total">
                                                {((item.product?.price || 0) * item.quantity).toFixed(2)} DZD
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-total">
                                    <span>Total Amount:</span>
                                    <span>{(selectedOrder.totalAmount || 0).toFixed(2)} DZD</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {selectedOrder.status === 'pending' && (
                                <>
                                    <button
                                        className="btn-action btn-accept large"
                                        onClick={(e) => {
                                            updateStatus(e, selectedOrder._id, 'confirmed');
                                        }}
                                    >
                                        Accept Order
                                    </button>
                                    <button
                                        className="btn-action btn-decline large"
                                        onClick={(e) => {
                                            updateStatus(e, selectedOrder._id, 'cancelled');
                                        }}
                                    >
                                        Decline Order
                                    </button>
                                </>
                            )}
                            <button className="btn-close-modal" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
