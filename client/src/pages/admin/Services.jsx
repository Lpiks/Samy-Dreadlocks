import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash, Edit } from 'lucide-react';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/services');
            setServices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAddService = () => {
        alert("Add Service functionality coming soon!");
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', margin: 0 }}>Manage Services</h1>
                <button
                    className="btn-primary"
                    onClick={handleAddService}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service._id} className="service-card" style={{ background: '#222' }}>
                            <div className="service-info">
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                <div className="service-meta">
                                    <span>${service.price}</span>
                                    <span>{service.duration}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminServices;
