import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/user/login', credentials);
            localStorage.setItem('auth-token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid Credentials');
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Admin Login</h2>
                {error && <div className="alert error">{error}</div>}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary btn-block">Login</button>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: 'var(--secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Home</Link>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;
