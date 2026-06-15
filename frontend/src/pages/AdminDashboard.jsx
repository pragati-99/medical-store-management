import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaDownload, FaEye, FaPlus, FaTimes } from 'react-icons/fa';


const API_URL = 'http://localhost:8080/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    originalPrice: '',
    stockQuantity: '',
    description: '',
    image: '',
    tag: '',
    discount: ''
  });

  // ==================== Fetch Data ====================
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/public`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/admin/all`);
      const data = await response.json();
      // Ensure data is array
      const ordersArray = Array.isArray(data) ? data : (data.orders || []);
      setOrders(ordersArray);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Product Handlers ====================
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      stockQuantity: '',
      description: '',
      image: '',
      tag: '',
      discount: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      brand: product.brand || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stockQuantity: product.stockQuantity || '',
      description: product.description || '',
      image: product.image || '',
      tag: product.tag || '',
      discount: product.discount || ''
    });
    setShowModal(true);
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price) * 1.4,
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description,
        image: formData.image || 'https://via.placeholder.com/400x400?text=Product',
        tag: formData.tag || 'New',
        discount: parseInt(formData.discount) || 0,
        inStock: true
      };

      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('✅ Product added successfully!');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const productData = {
        id: editingProduct.id,
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        stockQuantity: parseInt(formData.stockQuantity),
        description: formData.description,
        image: formData.image,
        tag: formData.tag,
        discount: parseInt(formData.discount) || 0,
        inStock: true
      };

      const response = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('✅ Product updated successfully!');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/admin/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('✅ Product deleted successfully!');
          fetchProducts();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  // ==================== Order Handlers ====================
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert('✅ Order status updated!');
        fetchOrders();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

 const handleDownloadReport = async () => {
    try {
        const response = await fetch(`${API_URL}/orders/admin/report/download`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to download');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_report_${Date.now()}.xlsx`;  // ✅ .csv वरून .xlsx केलं
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('✅ Report downloaded successfully!');
    } catch (error) {
        console.error('Error downloading report:', error);
        alert('❌ Failed to download report: ' + error.message);
    }
};

  const viewOrderDetails = (order) => {
    let message = ` ORDER DETAILS\n\n`;
    message += `Order #: ${order.orderNumber}\n`;
    message += `Customer: ${order.customerName || order.user?.fullName || 'Guest'}\n`;
    message += `Date: ${new Date(order.orderDate).toLocaleString()}\n`;
    message += `Total: ₹${order.totalAmount}\n`;
    message += `Status: ${order.status}\n`;
    message += `Payment: ${order.paymentMethod}\n`;
    message += `Address: ${order.shippingAddress || 'N/A'}\n`;
    
    if (order.items && order.items.length > 0) {
      message += `\n--- Items ---\n`;
      order.items.forEach((item, idx) => {
        message += `${idx + 1}. ${item.productName || item.product?.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
      });
    }
    
    alert(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  // ==================== Helper Functions ====================
  const getCustomerName = (order) => {
    // Priority: customerName > user.fullName > user.username > Guest
    if (order.customerName) return order.customerName;
    if (order.user?.fullName) return order.user.fullName;
    if (order.user?.username) return order.user.username;
    return '👤 Guest';
  };

  // ==================== Loading State ====================
  if (loading) {
    return <div className="loading-container">Loading Dashboard...</div>;
  }

  // ==================== Render ====================
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>🛒 Admin Dashboard</h1>
        <div className="admin-actions">
          <button className="download-btn" onClick={handleDownloadReport}>
            <FaDownload /> Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{products.filter(p => p.stockQuantity < 10).length}</h3>
          <p>Low Stock</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'tab-active' : ''} onClick={() => setActiveTab('products')}>
           Products ({products.length})
        </button>
        <button className={activeTab === 'orders' ? 'tab-active' : ''} onClick={() => setActiveTab('orders')}>
           Orders ({orders.length})
        </button>
      </div>

      {/* ==================== PRODUCTS TAB ==================== */}
      {activeTab === 'products' && (
        <div className="admin-products">
          <button className="add-product-btn" onClick={openAddModal}>
            <FaPlus /> Add New Product
          </button>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="product-image">
                      <img 
                        src={product.image || 'https://via.placeholder.com/40'} 
                        alt={product.name} 
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.brand || '-'}</td>
                    <td className="price">₹{product.price}</td>
                    <td className={product.stockQuantity < 10 ? 'low-stock' : ''}>
                      {product.stockQuantity}
                    </td>
                    <td className="actions">
                      <button className="edit-btn" onClick={() => openEditModal(product)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(product.id, product.name)} title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {products.length === 0 && (
            <div className="no-data">No products found. Click "Add New Product" to get started.</div>
          )}
        </div>
      )}

      {/* ==================== ORDERS TAB ==================== */}
      {activeTab === 'orders' && (
        <div className="admin-orders">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-number">{order.orderNumber}</span>
                    </td>
                    <td className="customer-cell">
                      <div className="customer-info">
                        <span className="customer-name">{getCustomerName(order)}</span>
                        {order.customerEmail && (
                          <span className="customer-email">{order.customerEmail}</span>
                        )}
                      </div>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="price">₹{order.totalAmount}</td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`status-select status-${order.status?.toLowerCase()}`}
                      >
                        <option value="PENDING"> Pending</option>
                        <option value="CONFIRMED"> Confirmed</option>
                        <option value="SHIPPED"> Shipped</option>
                        <option value="DELIVERED"> Delivered</option>
                        <option value="CANCELLED"> Cancelled</option>
                      </select>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <button className="view-btn" onClick={() => viewOrderDetails(order)} title="View Details">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div className="no-data">No orders found.</div>
          )}
        </div>
      )}

      {/* ==================== ADD/EDIT PRODUCT MODAL ==================== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? ' Edit Product' : ' Add New Product'}</h2>
              <button className="close-modal" onClick={() => { setShowModal(false); resetForm(); }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Product Name */}
                <div className="form-group">
                  <label>Product Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter product name..."
                    required 
                  />
                </div>

                {/* Row 1: Category and Brand */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Personal Care" />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g., Dettol" />
                  </div>
                </div>

                {/* Row 2: Price and Original Price */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) <span className="required">*</span></label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹)</label>
                    <input type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="0.00" />
                  </div>
                </div>

                {/* Row 3: Stock Quantity and Discount */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock Quantity <span className="required">*</span></label>
                    <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} placeholder="0" required />
                  </div>
                  <div className="form-group">
                    <label>Discount (%)</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="0" />
                  </div>
                </div>

                {/* Row 4: Tag and Image URL */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Tag</label>
                    <select name="tag" value={formData.tag} onChange={handleInputChange}>
                      <option value="">Select Tag</option>
                      <option value="Essential">Essential</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Trending">Trending</option>
                      <option value="New">New</option>
                      <option value="Popular">Popular</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://... or /images/..." />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    name="description" 
                    rows="4" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    placeholder="Enter product description..."
                  ></textarea>
                 
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingProduct ? ' Update Product' : ' Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;