import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import './Products.css';

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        setQuantity(val);
    };

    return (
        <div className="product-card">
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
                <div className="product-price">{product.price.toFixed(2)} DZD</div>
                <p className="product-description">{product.description}</p>

                {product.inStock && (
                    <div className="quantity-selector">
                        <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            type="button"
                        >-</button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            className="qty-input"
                        />
                        <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            type="button"
                        >+</button>
                    </div>
                )}

                <button
                    id={`btn-${product._id}`}
                    className="btn-buy"
                    disabled={!product.inStock}
                    onClick={() => {
                        onAddToCart(product, quantity);
                        setQuantity(1); // Reset after adding
                    }}
                >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

const Products = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/api/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch products', err);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
            setCartCount(items.reduce((acc, item) => acc + item.quantity, 0));
        };

        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const addToCart = (product, quantity) => {
        const cartItem = {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        };

        const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const existingItemIndex = currentCart.findIndex(item => item.product === product._id);

        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            currentCart.push(cartItem);
        }

        localStorage.setItem('cartItems', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated')); // Trigger update

        // Visual feedback
        const btn = document.getElementById(`btn-${product._id}`);
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = "Added!";
            btn.style.background = "var(--success-color, #28a745)";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
            }, 1000);
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="products-page-root">
            <div className="page-header">
                <h1>Our Products</h1>
                <p>Explore our premium hair care products and accessories.</p>
                {cartCount > 0 && (
                    <div className="header-actions" style={{ marginTop: '20px' }}>
                        <a href="/checkout" className="btn-checkout-header" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 25px',
                            background: 'var(--primary-color, #d4af37)',
                            color: '#111',
                            textDecoration: 'none',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                            transition: 'transform 0.2s',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            <span>🛒 Checkout ({cartCount})</span>
                        </a>
                    </div>
                )}
            </div>

            <div className="container">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
