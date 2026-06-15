import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaGift } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! ${email}`);
    setEmail('');
  };
  
  return (
    <div className="newsletter">
      <FaGift style={{ fontSize: '50px', marginBottom: '20px' }} />
      <h3>Subscribe to Our Newsletter</h3>
      <p>Get 10% off on your first order + weekly health tips</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit">
          <FaPaperPlane style={{ marginRight: '8px' }} /> Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;