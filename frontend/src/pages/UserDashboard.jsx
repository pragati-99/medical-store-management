import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaMapMarker, FaShoppingBag, FaEdit, FaTrash, FaEye, FaSave, FaTimes, FaCheckCircle, FaClock, FaTruck, FaBox } from 'react-icons/fa';

const API_URL = 'http://localhost:8080/api';

const UserDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    address: user?.address || ''
  });
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', pincode: '' });

  useEffect(() => {
    fetchOrders();
    fetchAddresses();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/user/${user?.id}`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user?.id}/addresses`);
      const data = await response.json();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('✅ Profile updated successfully!');
        setEditingProfile(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          alert('✅ Order cancelled successfully!');
          fetchOrders();
        } else {
          alert('Failed to cancel order');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user?.id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        alert('✅ Address added successfully!');
        setShowAddressModal(false);
        setNewAddress({ name: '', street: '', city: '', pincode: '' });
        fetchAddresses();
      } else {
        alert('Failed to add address');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`${API_URL}/users/${user?.id}/addresses/${addressId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('✅ Address deleted!');
          fetchAddresses();
        } else {
          alert('Failed to delete address');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FaClock style={{ color: '#ffc107' }} />;
      case 'CONFIRMED': return <FaCheckCircle style={{ color: '#17a2b8' }} />;
      case 'SHIPPED': return <FaTruck style={{ color: '#007bff' }} />;
      case 'DELIVERED': return <FaBox style={{ color: '#28a745' }} />;
      default: return <FaClock />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#17a2b8';
      case 'SHIPPED': return '#007bff';
      case 'DELIVERED': return '#28a745';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading-container">Loading Dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.fullName}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <FaShoppingBag className="stat-icon" />
          <div>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" style={{ color: '#28a745' }} />
          <div>
            <h3>{orders.filter(o => o.status === 'DELIVERED').length}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" style={{ color: '#ffc107' }} />
          <div>
            <h3>{orders.filter(o => o.status === 'PENDING').length}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'orders' ? 'tab-active' : ''} onClick={() => setActiveTab('orders')}>
          <FaShoppingBag /> My Orders
        </button>
        <button className={activeTab === 'profile' ? 'tab-active' : ''} onClick={() => setActiveTab('profile')}>
          <FaUser /> Profile
        </button>
        <button className={activeTab === 'addresses' ? 'tab-active' : ''} onClick={() => setActiveTab('addresses')}>
          <FaMapMarker /> Addresses
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          {orders.length === 0 ? (
            <div className="no-orders">
              <FaShoppingBag size={50} style={{ color: '#ccc' }} />
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here!</p>
              <button className="shop-btn" onClick={() => window.location.href = '/products'}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-number">Order #{order.orderNumber}</span>
                      <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {getStatusIcon(order.status)} {order.status}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="order-item-mini">
                        <img src={item.product?.image || 'https://via.placeholder.com/50'} alt={item.product?.name} />
                        <div>
                          <h4>{item.product?.name}</h4>
                          <p>Qty: {item.quantity} x ₹{item.price}</p>
                        </div>
                        <span className="item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="more-items">+{order.items.length - 3} more items</div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                    <div className="order-actions">
                      <button className="view-order-btn" onClick={() => alert(JSON.stringify(order, null, 2))}>
                        <FaEye /> View Details
                      </button>
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.id)}>
                          <FaTrash /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              <h3>Personal Information</h3>
              {!editingProfile ? (
                <button className="edit-profile-btn" onClick={() => setEditingProfile(true)}>
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="profile-actions">
                  <button className="cancel-btn" onClick={() => setEditingProfile(false)}>
                    <FaTimes /> Cancel
                  </button>
                  <button className="save-btn" onClick={handleUpdateProfile}>
                    <FaSave /> Save
                  </button>
                </div>
              )}
            </div>

            {!editingProfile ? (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{user?.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Mobile Number:</span>
                  <span className="info-value">{user?.mobileNumber || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{user?.address || 'Not provided'}</span>
                </div>
              </div>
            ) : (
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={profileForm.fullName} onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={profileForm.email} disabled />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" value={profileForm.mobileNumber} onChange={(e) => setProfileForm({...profileForm, mobileNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea rows="2" value={profileForm.address} onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="addresses-section">
          <button className="add-address-btn" onClick={() => setShowAddressModal(true)}>
            <FaMapMarker /> Add New Address
          </button>

          <div className="addresses-grid">
            {addresses.map(addr => (
              <div key={addr.id} className="address-card">
                <h4>{addr.name}</h4>
                <p>{addr.street}</p>
                <p>{addr.city} - {addr.pincode}</p>
                <div className="address-actions">
                  <button className="delete-address-btn" onClick={() => handleDeleteAddress(addr.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {addresses.length === 0 && (
            <div className="no-addresses">
              <p>No saved addresses. Add one for faster checkout!</p>
            </div>
          )}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Address</h2>
              <button className="close-modal" onClick={() => setShowAddressModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Address Name (Home, Office, etc.)</label>
                <input type="text" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddressModal(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddAddress}>Add Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;