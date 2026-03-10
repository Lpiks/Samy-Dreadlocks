import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Plus, Trash2, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import confirmToast from '../../utils/confirmToast';
import './Categories.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/categories');
            setCategories(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load categories');
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/categories', { name: newCategory });
            setCategories([...categories, res.data]);
            toast.success('Category added successfully');
            setNewCategory('');
            setShowModal(false);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to add category');
        }
    };

    const handleDeleteCategory = (id) => {
        confirmToast('Are you sure? This might affect products using this category.', async () => {
            try {
                await api.delete(`/api/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
                toast.success('Category deleted');
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete category');
            }
        });
    };

    return (
        <div className="container admin-container">
            <Link to="/samyonesixr/products" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: '600', transition: 'color 0.2s' }}>
                <ArrowLeft size={18} />
                Back to Products
            </Link>

            <div className="categories-header">
                <h1 className="title-no-margin">Manage Categories</h1>
                <button className="btn-primary btn-add-category" onClick={() => setShowModal(true)}>
                    <Plus size={24} />
                </button>
            </div>

            {loading ? (
                <div className="loader"></div>
            ) : (
                <div className="categories-list">
                    {categories.length === 0 ? (
                        <p className="no-data">No categories found.</p>
                    ) : (
                        categories.map(category => (
                            <div key={category._id} className="category-item">
                                <span className="category-name">{category.name}</span>
                                <button className="btn-icon btn-delete" onClick={() => handleDeleteCategory(category._id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Add New Category</h2>
                            <button className="btn-close" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddCategory} className="category-form">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="e.g. Hair Care"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
