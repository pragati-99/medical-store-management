import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaPlay, FaShieldAlt, FaTruck, FaStar } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const heroStyle = {
    backgroundImage: `linear-gradient(135deg, rgba(21,101,192,0.92) 0%, rgba(13,71,161,0.88) 100%), url('/images/hero-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };
  
  return (
    <div className="hero-section" style={heroStyle}>
      <h2 className="animate-fadeUp">Highly Effective & Safe Products</h2>
      <p className="hero-tagline animate-slideRight">Premium quality health essentials for your family</p>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="shop-btn" onClick={() => navigate('/products')}>
          Shop Now <FaArrowRight style={{ marginLeft: '10px' }} />
        </button>
        
      </div>
      
      <div className="hero-stats">
        <div className="hero-stat-item">
          <FaShieldAlt /> Secure Payment
        </div>
        <div className="hero-stat-item">
          <FaStar style={{ color: '#FFC107' }} /> 4.9 Rating (10k+ reviews)
        </div>
      </div>
    </div>
  );
};

export default HeroSection;