import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! We'll contact you soon.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="section">
      <h2 className="section-title">Contact Us</h2>
      <p className="section-subtitle">We'd love to hear from you</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '40px' }}>
        {/* Contact Info */}
        <div>
          <div style={{ background: '#e8f5e9', padding: '30px', borderRadius: '15px' }}>
            <h3 style={{ marginBottom: '20px', color: '#2c5f2d' }}>Get in Touch</h3>
            <p style={{ marginBottom: '15px' }}>📧 support@healthmart.com</p>
            <p style={{ marginBottom: '15px' }}>📞 +1 (800) 123-4567</p>
            <p style={{ marginBottom: '15px' }}>📍 123 Health Street, Wellness City, HC 12345</p>
            <p>⏰ Mon-Fri: 9AM - 6PM</p>
          </div>
        </div>
        
        {/* Contact Form */}
        <div>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Message</label>
              <textarea 
                required
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
              ></textarea>
            </div>
            <button type="submit" className="shop-btn" style={{ width: '100%' }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;