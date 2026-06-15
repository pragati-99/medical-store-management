import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBaby, 
  FaHeartbeat, 
  FaTooth, 
  FaSmile,
  FaArrowRight,
  FaPills,
  FaWind
} from 'react-icons/fa';

const categories = [
  { 
    id: 2,
    name: "Baby Care", 
    icon: <FaBaby />, 
    badge: "Safe", 
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    iconColor: "#f5576c",
    description: "Gentle care for little ones",
    productCount: "8"
  },
  { 
    id: 3,
    name: "Health Care", 
    icon: <FaHeartbeat />, 
    badge: "Trusted", 
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    iconColor: "#4facfe",
    description: "Premium health essentials",
    productCount: "15"
  },
  { 
    id: 4,
    name: "Oral Care", 
    icon: <FaTooth />, 
    badge: "Dental", 
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    iconColor: "#fa709a",
    description: "Brighten your smile",
    productCount: "6"
  },
  { 
    id: 6,
    name: "Skin Care", 
    icon: <FaSmile />, 
    badge: "Glow", 
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    iconColor: "#ff9a9e",
    description: "Radiant and healthy skin",
    productCount: "12"
  },
  { 
    id: 7,
    name: "Hair Care", 
    icon: <FaWind />, 
    badge: "Strong", 
    gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    iconColor: "#52c41a",
    description: "Healthy and shiny hair",
    productCount: "5"
  },
  { 
    id: 8,
    name: "Medicine", 
    icon: <FaPills />, 
    badge: "Essential", 
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    iconColor: "#f5222d",
    description: "Trusted medicines",
    productCount: "8"
  }
];

const Categories = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  
  const handleCategoryClick = (categoryName) => {
    let param = categoryName.toLowerCase().replace(/ /g, '');
    navigate(`/products?category=${param}`);
  };
  
  return (
    <section className="categories-section">
      <div className="categories-header">
        <h2 className="categories-title">Shop by Category</h2>
        <p className="categories-subtitle">Don't miss this week's special offers</p>
        <div className="title-decoration">
          <span className="decoration-line"></span>
          <span className="decoration-icon">✦</span>
          <span className="decoration-line"></span>
        </div>
      </div>
      
      <div className="categories-container">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`category-card-modern ${hoveredId === cat.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(cat.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div 
              className="category-bg"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              <div className="category-overlay" style={{ background: cat.gradient }}></div>
            </div>
            
            <div className="category-content">
              <div className="category-icon-wrapper">
                <div className="category-icon" style={{ color: cat.iconColor }}>
                  {cat.icon}
                </div>
                <span className="category-badge-new" style={{ background: cat.iconColor }}>
                  {cat.badge}
                </span>
              </div>
              
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-description">{cat.description}</p>
              
              {cat.productCount && (
                <div className="category-stats">
                  <span className="stat-number">{cat.productCount}</span>
                  <span className="stat-label">Products</span>
                </div>
              )}
              
              <button className="shop-now-btn">
                Shop Now <FaArrowRight className="btn-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;