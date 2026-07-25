import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X, Eye, Package, Clock, DollarSign } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Orders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const navigate = useNavigate();
    const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH;

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            navigate(`${ADMIN_PATH}/login`);
        } else {
            fetchOrders();
        }
    }, [navigate, ADMIN_PATH]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders');
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
            await api.put(
                `/api/orders/${orderId}/status`,
                { status: newStatus }
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

    const filteredOrders = dateFilter
        ? orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              return (
                  orderDate.getFullYear() === dateFilter.getFullYear() &&
                  orderDate.getMonth() === dateFilter.getMonth() &&
                  orderDate.getDate() === dateFilter.getDate()
              );
          })
        : orders;

    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
    const currentRevenue = filteredOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    if (loading) return <div className="admin-loading">Loading orders...</div>;

    return (
        <div className="admin-orders-container">
            <div className="admin-orders-header">
                <h1 className="admin-orders-title">Manage Orders</h1>
                <div className="orders-filter-container">
                    <label>Filter Date:</label>
                    <DatePicker
                        selected={dateFilter}
                        onChange={(date) => setDateFilter(date)}
                        dateFormat="dd/MM/yyyy"
                        className="admin-date-input"
                        placeholderText="All Orders"
                        isClearable
                    />
                </div>
            </div>

            <div className="orders-metrics">
                <div className="metric-card">
                    <div className="metric-icon"><Package size={24} /></div>
                    <div className="metric-info">
                        <h3>Total Orders</h3>
                        <p>{totalOrders}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon pending"><Clock size={24} /></div>
                    <div className="metric-info">
                        <h3>Pending</h3>
                        <p>{pendingOrders}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon revenue"><DollarSign size={24} /></div>
                    <div className="metric-info">
                        <h3>Revenue</h3>
                        <p>{currentRevenue.toFixed(2)} DZD</p>
                    </div>
                </div>
            </div>

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
                            {filteredOrders.map(order => (
                                <tr key={order._id} onClick={() => setSelectedOrder(order)} className="order-row-clickable">
                                    <td data-label="Date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td data-label="Customer">
                                        <div className="customer-info-wrapper">
                                            <div className="customer-avatar">
                                                {order.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="customer-info">
                                                <strong>{order.customerName}</strong>
                                                <p>{order.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Items">
                                        <div className="order-items-mini-list">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="item-badge">
                                                    {item.quantity}x {item.product?.name || 'Unknown'}
                                                </span>
                                            ))}
                                            {order.items.length > 2 && <span className="item-more">+{order.items.length - 2} more</span>}
                                        </div>
                                    </td>
                                    <td data-label="Total">{(order.totalAmount || 0).toFixed(2)} DZD</td>
                                    <td data-label="Status">
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td data-label="Actions">
                                        <div className="order-actions">
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn-action-icon btn-accept"
                                                        onClick={(e) => updateStatus(e, order._id, 'confirmed')}
                                                        title="Accept"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        className="btn-action-icon btn-decline"
                                                        onClick={(e) => updateStatus(e, order._id, 'cancelled')}
                                                        title="Decline"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button 
                                                className="btn-action-icon btn-view" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
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
                                <div className="info-group address-group">
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
                                            {item.product ? (
                                                <img src={item.product.image} alt={item.product.name} onError={(e) => { e.target.style.display = 'none' }} />
                                            ) : (
                                                <div className="broken-img-placeholder"><Package size={24} /></div>
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
                                        className="modal-btn modal-btn-accept"
                                        onClick={(e) => {
                                            updateStatus(e, selectedOrder._id, 'confirmed');
                                        }}
                                    >
                                        <Check size={18} /> Accept Order
                                    </button>
                                    <button
                                        className="modal-btn modal-btn-decline"
                                        onClick={(e) => {
                                            updateStatus(e, selectedOrder._id, 'cancelled');
                                        }}
                                    >
                                        <X size={18} /> Decline Order
                                    </button>
                                </>
                            )}
                            <button className="modal-btn modal-btn-close" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
