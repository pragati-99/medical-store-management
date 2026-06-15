import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarker, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>HealthMart</h4>
          <p>Your trusted partner for health & wellness products since 2010.</p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <FaFacebook style={{ cursor: 'pointer', fontSize: '22px' }} />
            <FaTwitter style={{ cursor: 'pointer', fontSize: '22px' }} />
            <FaInstagram style={{ cursor: 'pointer', fontSize: '22px' }} />
            <FaLinkedin style={{ cursor: 'pointer', fontSize: '22px' }} />
          </div>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li>Baby Care</li>
            <li>Health Care</li>
            <li>Oral Care</li>
            <li>Personal Care</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p><FaMapMarker style={{ marginRight: '8px' }} /> 123 Health Street, Wellness City</p>
          <p><FaPhone style={{ marginRight: '8px' }} /> +1 234 567 8900</p>
          <p><FaEnvelope style={{ marginRight: '8px' }} /> support@healthmart.com</p>
          <p><FaClock style={{ marginRight: '8px' }} /> Mon-Fri: 9AM - 6PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 HealthMart. All rights reserved. | quality products, and excellent service.</p>
      </div>
    </footer>
  );
};

export default Footer;