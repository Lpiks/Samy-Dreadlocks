import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(items);
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                ...formData,
                items: cartItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity
                })),
                totalAmount: calculateTotal()
            };

            await api.post('/api/orders', orderData);

            toast.success('Order placed successfully!');
            localStorage.removeItem('cartItems');
            setCartItems([]);
            // Navigate to success page or home
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Checkout error:', err);
            const message = err.response?.data?.message || 'Failed to place order';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = (productId) => {
        const newItems = cartItems.filter(item => item.product !== productId);
        setCartItems(newItems);
        localStorage.setItem('cartItems', JSON.stringify(newItems));
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container empty-cart">
                <h2>Your Cart is Empty</h2>
                <button className="btn-continue" onClick={() => navigate('/products')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-content">
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    <div className="checkout-items">
                        {cartItems.map((item) => (
                            <div key={item.product} className="checkout-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>${item.price.toFixed(2)} x {item.quantity}</p>
                                </div>
                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button className="btn-remove" onClick={() => removeItem(item.product)}>×</button>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-total">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>

                <div className="checkout-form-section">
                    <h2>Shipping Details</h2>
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                minLength="2"
                            />
                        </div>



                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[0-9+\s-]{8,20}"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div className="form-group">
                            <label>Shipping Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn-place-order"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
