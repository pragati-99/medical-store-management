import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaStarHalf, FaShoppingCart, FaArrowLeft, FaRupeeSign } from 'react-icons/fa';

const API_URL = 'http://localhost:8080/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    
    const success = await addToCart(product.id, quantity);
    if (success) {
      alert('✅ Product added to cart!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = rating || 4.5;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#FFC107" size={16} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half" color="#FFC107" size={16} />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} color="#E0E0E0" size={16} />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Product Not Found</h2>
          <button className="shop-btn" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button className="back-to-products" onClick={() => navigate('/products')}>
        <FaArrowLeft /> Back to Products
      </button>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          <img 
            src={product.image || 'https://via.placeholder.com/500x500?text=Product'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/500x500?text=${product.name?.charAt(0) || 'P'}`;
            }}
          />
          {product.discount > 0 && (
            <div className="discount-badge-large">-{product.discount}%</div>
          )}
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <div className="product-brand-category">
            <span className="product-brand">{product.brand}</span>
            <span className="separator">•</span>
            <span className="product-category">{product.category}</span>
          </div>
          
          <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="reviews">({product.reviews || 0} reviews)</span>
          </div>
          
          <div className="product-pricing">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="discount-save">Save {product.discount}%</span>
            )}
          </div>
          
          <div className="product-stock">
            {product.stockQuantity > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
          
          {product.stockQuantity > 0 && (
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;