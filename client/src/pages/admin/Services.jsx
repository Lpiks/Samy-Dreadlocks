import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import confirmToast from '../../utils/confirmToast';
import './Services.css';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        imageUrl: '' // Optional
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/api/services');
            setServices(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load services');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: '',
            imageUrl: ''
        });
        setEditingService(null);
        setShowModal(false);
    };

    const handleAddClick = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            imageUrl: service.imageUrl || ''
        });
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        confirmToast('Are you sure you want to delete this service?', async () => {
            try {
                await api.delete(`/api/services/${id}`);
                setServices(services.filter(s => s._id !== id));
                toast.success('Service deleted successfully');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete service');
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingService) {
                // Update
                const res = await api.put(`/api/services/${editingService._id}`, formData);
                setServices(services.map(s => s._id === editingService._id ? res.data : s));
                toast.success('Service updated!');
            } else {
                // Create
                const res = await api.post('/api/services', formData);
                setServices([...services, res.data]);
                toast.success('Service created!');
            }
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    return (
        <div className="container admin-container">
            <div className="services-header">
                <h1 className="title-no-margin">Manage Services</h1>
                <button
                    className="btn-primary btn-add-service"
                    onClick={handleAddClick}
                    title="Add Service"
                >
                    <Plus size={24} />
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
                                <div className="service-actions">
                                    <button className="btn-icon btn-edit" onClick={() => handleEditClick(service)}>
                                        <Pencil size={18} />
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(service._id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                            <button className="btn-close" onClick={resetForm}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="service-form">
                            <div className="form-group">
                                <label>Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Service Image</label>
                                <ImageUpload
                                    imageUrl={formData.imageUrl}
                                    onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Duration (e.g. "2 hours")</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
