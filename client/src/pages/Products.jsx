import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './Products.css';

const ProductCard = ({ product, onAddToCart }) => {
    const { t } = useTranslation();
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
                    <div className="out-of-stock-badge">{t('products.outOfStock')}</div>
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
                    {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
                </button>
            </div>
        </div>
    );
};

const Products = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/api/products'),
                    api.get('/api/categories')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch initial data', err);
                setLoading(false);
            }
        };

        fetchInitialData();
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

        // Visual feedback - Crossing Strands
        const btn = document.getElementById(`btn-${product._id}`);
        const cartIcon = document.querySelector('.nav-cart-link');
        
        if (btn && cartIcon) {
            const btnRect = btn.getBoundingClientRect();
            const cartRect = cartIcon.getBoundingClientRect();
            
            const strandsAnim = document.createElement('div');
            strandsAnim.className = 'crossing-strands-anim';
            strandsAnim.innerHTML = `<div class="strand strand-left"></div><div class="strand strand-right"></div>`;
            document.body.appendChild(strandsAnim);
            
            const startX = btnRect.left + (btnRect.width / 2);
            const startY = btnRect.top + (btnRect.height / 2);
            const endX = cartRect.left + (cartRect.width / 2);
            const endY = cartRect.top + (cartRect.height / 2);
            
            strandsAnim.style.left = `${startX}px`;
            strandsAnim.style.top = `${startY}px`;
            strandsAnim.style.setProperty('--tx', `${endX - startX}px`);
            strandsAnim.style.setProperty('--ty', `${endY - startY}px`);
            
            requestAnimationFrame(() => {
                strandsAnim.classList.add('fly-to-cart');
            });
            
            setTimeout(() => {
                strandsAnim.remove();
                cartIcon.classList.add('cart-bounce');
                setTimeout(() => {
                    cartIcon.classList.remove('cart-bounce');
                }, 300);
            }, 1600);
            
            const originalText = btn.innerText;
            btn.innerText = 'LOCKED IN!';
            btn.style.background = "var(--primary-color, #d4af37)";
            btn.style.color = "#000";
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.color = "";
            }, 1800);
        }
    };

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    return (
        <div className="products-page-root">
            <Helmet>
                <title>{t('metadata.products.title')}</title>
                <meta name="description" content={t('metadata.products.description')} />
            </Helmet>
            <div className="page-header">
                <h1>{t('products.title')}</h1>
                <p>{t('products.subtitle')}</p>
            </div>

            <div className="container">
                <div className="category-filters">
                    <button
                        className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('All')}
                    >
                        {t('products.allCategories')}
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>{t('products.noProducts')}</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
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
