import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaSignOutAlt, FaShieldAlt, FaBars, FaTimes, FaPhoneAlt, FaTruck, FaShieldAlt as FaSecure, FaChartLine, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>📞 (+12) 354 6789</span>
          <span>✉️ support@healthmart.com</span>
        </div>
        <div className="top-bar-center">
          <span>🎉 Super Discount - Up to 50% OFF!</span>
        </div>
        <div className="top-bar-right">
          <span>📦 Free Shipping on orders ₹50+</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate('/')}>
            <h1>HealthMart</h1>
            <p>Your Trusted Health Partner</p>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-menu desktop-nav">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {/* Header Icons */}
          <div className="header-icons">
            {/* Search */}
            <div className="search-wrapper">
              <FaSearch onClick={() => setSearchOpen(!searchOpen)} className="icon" />
              {searchOpen && (
                <form className="search-dropdown" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                  <button type="submit">Search</button>
                </form>
              )}
            </div>


            {/* Wishlist */}
            <Link to="/wishlist" className="nav-link">
              <FaHeart /> 
            </Link>

            {/* Cart */}
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <FaShoppingCart className="icon" />
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
            </div>

            {/* User Menu - Dashboard Link Here */}
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-dropdown">
                  <span className="user-name">
                    <FaUser /> {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <div className="dropdown-content">
                    {/* Dashboard Link - ADD THIS */}

                    <Link to="/orders">
                      <FaShoppingCart /> My Orders
                    </Link>

                    {/* Admin Panel - Only for ADMIN */}
                    {user?.role === 'ADMIN' && (
                      <>
                        <hr />
                        <Link to="/admin" className="admin-dropdown-item">
                          <FaChartLine /> Admin Panel
                        </Link>
                      </>
                    )}

                    <hr />
                    <button onClick={logout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Dashboard</Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="admin-link">Admin Panel</Link>
          )}
          {!isAuthenticated && (
            <>
              <hr />
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-item">
          <FaTruck /> Free Shipping on orders ₹50+
        </div>
        <div className="announcement-item">
          <FaSecure /> 100% Authentic Products
        </div>
        <div className="announcement-item">
          <FaPhoneAlt /> 24/7 Customer Support
        </div>
      </div>
    </>
  );
};

export default Header;