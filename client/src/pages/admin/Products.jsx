import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Edit2, Trash2, X, Save, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import confirmToast from '../../utils/confirmToast';
import './Products.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        category: 'General',
        price: '',
        description: '',
        image: '',
        inStock: true
    });

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/api/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch products');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await api.put(`/api/products/${currentProduct._id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/api/products', formData);
                toast.success('Product created successfully');
            }

            fetchProducts();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            category: product.category || 'General',
            price: product.price,
            description: product.description,
            image: product.image,
            inStock: product.inStock
        });
        setCurrentProduct(product);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        confirmToast('Are you sure you want to delete this product?', async () => {
            try {
                await api.delete(`/api/products/${id}`);
                toast.success('Product deleted successfully');
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                console.error(err);
                toast.error('Failed to delete product');
            }
        });
    };

    const handleCloseModal = () => {
        setFormData({
            name: '',
            category: 'General',
            price: '',
            description: '',
            image: '',
            inStock: true
        });
        setIsEditing(false);
        setCurrentProduct(null);
        setShowModal(false);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-products-container">
            <div className="admin-products-header">
                <div>
                    <h2>Product Management</h2>
                    <p className="subtitle">Manage your inventory, prices, and stock.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => navigate(`${import.meta.env.VITE_ADMIN_PATH}/categories`)} style={{ marginRight: '1rem' }}>
                        Manage Categories
                    </button>
                    <button className="add-product-btn" onClick={() => setShowModal(true)}>
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            <div className="products-controls">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown">
                    <Filter size={18} className="filter-icon" />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Info</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id}>
                                <td data-label="Image">
                                    <div className="table-img-wrapper">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/100?text=No+Img'}
                                            alt={product.name}
                                        />
                                    </div>
                                </td>
                                <td data-label="Info">
                                    <div className="product-name-cell">
                                        <span className="name">{product.name}</span>
                                        <span className="desc-truncate">{product.description}</span>
                                    </div>
                                </td>
                                <td data-label="Category"><span className="category-tag">{product.category}</span></td>
                                <td data-label="Price" className="price-cell">${Number(product.price).toFixed(2)}</td>
                                <td data-label="Status">
                                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td data-label="Actions">
                                    <div className="action-buttons">
                                        <button className="action-btn edit" onClick={() => handleEdit(product)} title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    {searchTerm ? 'No matching products found.' : 'No products found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target.className === 'modal-overlay') handleCloseModal();
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="btn-close" onClick={handleCloseModal}><X size={24} /></button>
                        </div>

                        <form className="product-form-modal" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange}>
                                        <option value="General">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Product description..."
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Image</label>
                                <ImageUpload
                                    imageUrl={formData.image}
                                    onImageUpload={handleImageUpload}
                                />
                            </div>

                            <div className="form-group toggle-group">
                                <label>Status</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <span className="status-label">
                                    {formData.inStock ? 'Available in Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="submit-btn full-width">
                                    {isEditing ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
