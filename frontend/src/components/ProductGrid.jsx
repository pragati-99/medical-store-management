import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalf, FaShoppingCart, FaEye, FaCheck, FaArrowRight } from 'react-icons/fa';
import { productAPI } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductGrid = ({ category }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    fetchProducts();
  }, [category]);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (category && category !== '') {
        console.log('Fetching category:', category);
        data = await productAPI.getProductsByCategory(category);
      } else {
        console.log('Fetching all products');
        data = await productAPI.getAllProducts();
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating || 4.5;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#FFC107" size={14} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" color="#FFC107" size={14} />);
    }
    // Add empty stars if needed
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} color="#E0E0E0" size={14} />);
    }
    return stars;
  };
  
const handleAddToCart = async (e, product) => {
  e.stopPropagation();
  e.preventDefault();
  
  console.log('Add to cart clicked for product:', product.id, product.name);
  
  if (!isAuthenticated) {
    alert('Please login first');
    navigate('/login');
    return;
  }
  
  if (!product || !product.id) {
    console.error('Invalid product:', product);
    return;
  }
  
  setAddedToCart({ [product.id]: true });
  
  const success = await addToCart(product.id, 1);
  console.log('Add to cart success:', success);
  
  if (!success) {
    setAddedToCart({});
  } else {
    setTimeout(() => {
      setAddedToCart({});
    }, 2000);
  }
};
  
  const quickView = (e, product) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found in this category.</p>
        <button className="shop-btn" onClick={() => navigate('/products')}>
          View All Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="products-section">
      <div className="products-header">
        <div className="products-title-area">
          <h3 className="products-title">
            {category ? `${category} Products` : 'Featured Products'}
          </h3>
          <p className="products-subtitle">Hand-picked just for you</p>
        </div>
        {!category && (
          <div className="products-view-all">
            <button onClick={() => navigate('/products')} className="view-all-btn">
              View All <FaArrowRight />
            </button>
          </div>
        )}
      </div>
      
      <div className="products-grid">
        {products.map((product, index) => (
          <div 
            key={product.id || index} 
            className={`product-card-premium ${hoveredProduct === product.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Discount Badge - Show only if discount > 0 */}
            {product.discount > 0 && (
              <div className="discount-badge">
                -{product.discount}%
              </div>
            )}
            
            <div className="product-image-container-premium">
              <img 
                src={product.image || 'https://placehold.co/400x400/1565C0/white?text=' + (product.name?.charAt(0) || 'P')} 
                alt={product.name || 'Product'}
                className="product-image-premium"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x400/1565C0/white?text=${product.name?.charAt(0) || 'P'}`;
                }}
              />
              
              {product.tag && product.tag !== '' && (
                <div className="product-badge-premium" style={{ background: product.badgeColor || '#FF9800' }}>
                  {product.tag}
                </div>
              )}
              
              <div className="quick-actions-overlay">
                <button className="quick-action-btn" onClick={(e) => quickView(e, product)} title="Quick View">
                  <FaEye />
                </button>
                <button className="quick-action-btn" onClick={(e) => handleAddToCart(e, product)} title="Add to Cart">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            
            
            <div className="product-info-premium">
              <div className="product-brand-category">
                <span className="product-brand">{product.brand || 'HealthMart'}</span>
                <span className="product-category-dot">•</span>
                <span className="product-category-premium">{product.category || 'General'}</span>
              </div>
              
              <h4 className="product-name-premium">{product.name || 'Product'}</h4>
              
              <div className="product-rating-premium">
                <div className="stars">{renderStars(product.rating)}</div>
                <span className="rating-count-premium">({product.reviews || 0})</span>
              </div>
              
              <div className="product-price-premium">
                <span className="current-price">₹{(product.price || 0).toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="original-price-premium">₹{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              
              <button 
                className={`add-to-cart-btn-premium ${addedToCart[product.id] ? 'added' : ''}`}
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stockQuantity === 0}
              >
                {addedToCart[product.id] ? (
                  <><FaCheck /> Added!</>
                ) : (
                  <><FaShoppingCart /> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;