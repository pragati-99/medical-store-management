import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/user/${user?.id}`);
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete Order Function
    const handleDeleteOrder = async (orderId, orderNumber) => {
        if (window.confirm(`Are you sure you want to delete Order #${orderNumber}?`)) {
            try {
                const response = await fetch(`http://localhost:8080/api/orders/user/${orderId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                
                if (result.success) {
                    alert('✅ Order deleted successfully!');
                    fetchOrders(); // Refresh orders list
                } else {
                    alert('❌ ' + result.message);
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('❌ Failed to delete order');
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Loading orders...</div>;
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">📋 My Orders</h1>
            
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>No orders yet</p>
                    <button onClick={() => window.location.href = '/products'}>Start Shopping</button>
                </div>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            {/* Order Header with Delete Button */}
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-number">#{order.orderNumber}</span>
                                    <span className="order-date">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="order-actions">
                                    <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    
                                    {(order.status === 'CANCELLED' || order.status === 'DELIVERED') && (
                                        <button 
                                            className="delete-order-btn"
                                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                                            title="Delete Order"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Order Items */}
                            <div className="order-items">
                                {order.items?.slice(0, 2).map((item) => (
                                    <div key={item.id} className="order-item">
                                        <img 
                                            src={item.productImage || 'https://via.placeholder.com/50'} 
                                            alt={item.productName}
                                            className="item-image"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                        />
                                        <div className="item-info">
                                            <span className="item-name">{item.productName}</span>
                                            <span className="item-price">₹{item.price} × {item.quantity}</span>
                                        </div>
                                        <div className="item-total">
                                            ₹{item.total}
                                        </div>
                                    </div>
                                ))}
                                {order.items?.length > 2 && (
                                    <div className="more-items">
                                        +{order.items.length - 2} more items
                                    </div>
                                )}
                            </div>
                            
                            {/* Order Footer */}
                            <div className="order-footer">
                                <div className="order-total">
                                    <span>Total:</span>
                                    <strong>₹{order.totalAmount}</strong>
                                </div>
                                <div className="order-payment">
                                    {order.paymentMethod}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;