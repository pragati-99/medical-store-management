import React, { useState } from 'react';
import { FaStar, FaQuoteLeft, FaUserCircle, FaHeart, FaSmile, FaThumbsUp, FaCheckCircle } from 'react-icons/fa';

const testimonials = [
  { 
    id: 1,
    text: "The organic baby wipes are absolutely wonderful! So soft and gentle on my baby's skin. Highly effective and safe products.", 
    author: "Rajesh Sharma",
    rating: 5,
    image: "/images/t-1.jpg",
    role: "Happy Parent",
    product: "Baby Wipes",
    date: "2 months ago"
  },
  { 
    id: 2,
    text: "Vitamin D3 drops have improved my family's health significantly. Quality products that actually work as promised.", 
    author: "Priya Patel",
    rating: 5,
    image: "/images/t-2.jpg",
    role: "Health Enthusiast",
    product: "Vitamin D3",
    date: "1 month ago"
  },
  { 
    id: 3,
    text: "The fluoride toothpaste leaves my teeth feeling so clean and fresh. Best oral care product I've ever used!", 
    author: "Neha Gupta",
    rating: 5,
    image: "/images/t-4.jpg",
    role: "Dental Care User",
    product: "Toothpaste",
    date: "3 weeks ago"
  }
 
];

const Testimonials = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        color={i < rating ? "#FFC107" : "#E0E0E0"} 
        size={14}
      />
    ));
  };

  return (
    <div className="testimonials-wrapper">
      <div className="testimonials-header">
        <h2 className="testimonials-title">What Our <span className="highlight">Customers</span> Say</h2>
        <p className="testimonials-subtitle">Join thousands of satisfied customers who trust HealthMart</p>
        
      </div>
      
      <div className="testimonials-grid-modern">
        {testimonials.map((t, idx) => (
          <div 
            key={t.id} 
            className={`testimonial-card-modern ${hoveredIndex === idx ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Quote Icon */}
            <div className="quote-icon-wrapper">
              <FaQuoteLeft className="quote-icon" />
            </div>
            
            {/* Rating Stars */}
            <div className="testimonial-rating">
              {renderStars(t.rating)}
              <span className="rating-value">{t.rating}.0</span>
            </div>
            
            {/* Testimonial Text */}
            <p className="testimonial-text-modern">"{t.text}"</p>
            
           
            
            {/* Author Info */}
            <div className="author-info-modern">
              {t.image ? (
                <img 
                  src={t.image} 
                  alt={t.author} 
                  className="author-image"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${t.author.charAt(0)}&background=1565C0&color=fff`;
                  }}
                />
              ) : (
                <div className="author-avatar-placeholder">
                  {t.author.charAt(0)}
                </div>
              )}
              <div className="author-details">
                <p className="author-name">{t.author}</p>
                <p className="author-role">{t.role}</p>
                <p className="review-date">{t.date}</p>
              </div>
              <div className="trust-badge">
                <FaThumbsUp /> Verified
              </div>
            </div>
            
            {/* Hover Effect Overlay */}
            {hoveredIndex === idx && (
              <div className="testimonial-hover-overlay">
                <FaSmile className="hover-icon" />
                <p>Happy Customer</p>
              </div>
            )}
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default Testimonials;