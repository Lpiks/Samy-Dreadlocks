import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <form onSubmit={handleLogin} style={{ background: '#2a2a2a', padding: '2rem', borderRadius: '10px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ color: 'var(--primary)', textAlign: 'center' }}>Admin Login</h2>
                {error && <div className="alert error" style={{ color: 'red', borderColor: 'red', background: 'rgba(255,0,0,0.1)' }}>{error}</div>}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary btn-block">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
