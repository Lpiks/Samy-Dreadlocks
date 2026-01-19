import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import './Services.css';

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
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Initating...',
                success: 'Add Service functionality coming soon!',
                error: 'Error',
            }
        );
    };

    return (
        <div className="container admin-container">
            <div className="services-header">
                <h1 className="title-no-margin">Manage Services</h1>
                <button
                    className="btn-primary btn-add-service"
                    onClick={handleAddService}
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service._id} className="service-card">
                            <div className="service-info">
                                <h3>{service.name}</h3>
                                <p className="service-access">{service.description}</p>
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
