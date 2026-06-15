import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { initiateRazorpayPayment } from '../services/razorpay';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    customerName: user?.fullName || user?.username || '',
    email: user?.email || '',
    phone: user?.mobileNumber || user?.phone || '',
    address: 'Online Delivery'
  });

  // Safe check for cart items
  const cartItems = cart?.items || [];
  const cartLength = cartItems.length;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    await updateQuantity(itemId, newQuantity);
    setLoading(false);
  };

  const openCheckoutModal = () => {
    if (!user?.id) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (cartLength === 0) {
      alert('Cart is empty');
      return;
    }

    setCustomerDetails({
      customerName: user?.fullName || user?.username || '',
      email: user?.email || '',
      phone: user?.mobileNumber || user?.phone || '',
      address: 'Online Delivery'
    });

    setShowCheckoutModal(true);
  };

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckoutSubmit = async () => {
    if (!customerDetails.customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!customerDetails.email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!customerDetails.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerName: customerDetails.customerName,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          paymentMethod: 'COD'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Order placed successfully!\nOrder Number: ${data.orderNumber || 'N/A'}`);
        setShowCheckoutModal(false);
        await fetchCart();
        navigate('/orders');
      } else {
        alert('Checkout failed: ' + (data.message || data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Make sure backend is running on port 8080');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Razorpay Payment Handler - योग्यरित्या items पाठवतो
  const handleRazorpayPayment = async () => {
    if (!user?.id) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    if (cartLength === 0) {
      alert('Cart is empty');
      return;
    }

    if (!customerDetails.customerName.trim()) {
      alert('Please enter your name in the form');
      return;
    }

    setLoading(true);

    // ✅ IMPORTANT: Cart items save करून ठेवा
    const currentCartItems = [...cartItems];
    const currentTotal = getCartTotal();

    await initiateRazorpayPayment(
      user.id,
      currentTotal,
      async (response) => {
        alert(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        
        try {
          // ✅ येथे items array पाठवतो
          const orderResponse = await fetch('http://localhost:8080/api/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              customerName: customerDetails.customerName,
              email: customerDetails.email,
              phone: customerDetails.phone,
              address: customerDetails.address || 'Online Delivery',
              paymentMethod: 'RAZORPAY',
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              amount: currentTotal,
              items: currentCartItems.map(item => ({
                productId: item.product?.id,
                quantity: item.quantity,
                price: item.price,
                productName: item.product?.name
              }))
            })
          });

          const orderData = await orderResponse.json();
          console.log('Order response:', orderData);
          
          if (orderData.success) {
            alert(`✅ Order placed successfully!\nOrder Number: ${orderData.orderNumber}`);
            setShowCheckoutModal(false);
            await fetchCart();
            navigate('/orders');
          } else {
            alert('Payment successful but order failed. Contact support.\nError: ' + (orderData.message || orderData.error));
          }
        } catch (error) {
          console.error('Order placement error:', error);
          alert('Payment successful but order placement failed. Contact support.\nError: ' + error.message);
        }
      },
      (error) => {
        alert(`❌ Payment failed: ${error}`);
      }
    );

    setLoading(false);
  };

  // Empty cart check
  if (cartLength === 0) {
    return (
      <div className="cart-empty">
        <FaShoppingCart size={64} className="empty-cart-icon" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button className="shop-btn" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart ({cartLength} items)</h1>
          <button className="back-btn" onClick={() => navigate('/products')}>
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="product-info">
                      <img
                        src={item.product?.image || 'https://via.placeholder.com/80x80?text=Product'}
                        alt={item.product?.name}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=Product'}
                      />
                      <div>
                        <h4>{item.product?.name}</h4>
                        <p className="product-brand">{item.product?.brand}</p>
                      </div>
                    </td>
                    <td className="price">₹{item.price?.toFixed(2)}</td>
                    <td className="quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                          disabled={loading}
                        >
                          <FaMinus />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                          disabled={loading}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td className="total-price">₹{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)} disabled={loading}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              className="checkout-btn"
              onClick={openCheckoutModal}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <p className="payment-note">✓ Cash on Delivery available</p>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal-content checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Enter Delivery Details</h2>
              <button className="close-modal" onClick={() => setShowCheckoutModal(false)}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={customerDetails.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={customerDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address (Optional)</label>
                <textarea
                  name="address"
                  rows="2"
                  value={customerDetails.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address or leave empty for 'Online Delivery'"
                ></textarea>
                <small className="text-muted">💡 Leave empty for default "Online Delivery"</small>
              </div>

              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{cartLength}</span>
                </div>
                <div className="summary-row">
                  <span>Total Quantity:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowCheckoutModal(false)}>
                Cancel
              </button>
              <div className="payment-buttons">
                <button 
                  className="cod-btn" 
                  onClick={handleCheckoutSubmit} 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '💵 Cash on Delivery'}
                </button>
                <button 
                  className="razorpay-btn-modal" 
                  onClick={handleRazorpayPayment} 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '💳 Pay with Razorpay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;