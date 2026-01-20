import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './Products.css';

const Products = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="products-page-root">
            <div className="page-header">
                <h1>Our Products</h1>
                <p>Explore our premium hair care products and accessories.</p>
            </div>

            <div className="container">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <div className="product-card" key={product._id}>
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300x400?text=No+Image'}
                                        alt={product.name}
                                        loading="lazy"
                                    />
                                    {!product.inStock && (
                                        <div className="out-of-stock-badge">Out of Stock</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <div className="product-category">{product.category}</div>
                                    <h3 className="product-title">{product.name}</h3>
                                    <div className="product-price">${product.price.toFixed(2)}</div>
                                    <p className="product-description">{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
