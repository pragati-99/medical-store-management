import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const API_URL = 'http://localhost:8080/api';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCart();
    } else {
      setCart({ items: [], totalAmount: 0 });
    }
  }, [isAuthenticated, user]);
  
  const fetchCart = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching cart for user ID:', user.id);
      const response = await fetch(`${API_URL}/cart/${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Cart data received:', data);
        setCart(data);
      } else {
        console.log('Cart response not OK:', response.status);
        setCart({ items: [], totalAmount: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };
  
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) {
      alert('Please login first');
      return false;
    }
    
    try {
      console.log('Adding to cart - User ID:', user.id, 'Product ID:', productId);
      
      const response = await fetch(`${API_URL}/cart/add?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      
      const data = await response.json();
      console.log('Add to cart response:', data);
      
      if (response.ok && data.success) {
        await fetchCart();
        alert('✅ Product added to cart!');
        return true;
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Network error');
      return false;
    }
  };
  
  // ========== UPDATE QUANTITY FUNCTION ==========
 const updateQuantity = async (cartItemId, quantity) => {
  if (quantity < 1) return false;
  
  try {
    const response = await fetch(`${API_URL}/cart/update/${cartItemId}?userId=${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating quantity:', error);
    return false;
  }
};
  // ============================================
  
  const removeFromCart = async (cartItemId) => {
    try {
      console.log('Removing item - ID:', cartItemId);
      
      const response = await fetch(`${API_URL}/cart/remove/${cartItemId}?userId=${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchCart();
        alert('✅ Item removed from cart');
        return true;
      } else {
        alert('Failed to remove item');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Network error');
      return false;
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/clear/${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchCart();
        alert('✅ Cart cleared');
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    return false;
  };
  
  const getCartTotal = () => cart.totalAmount || 0;
  const getCartItemCount = () => cart.items?.length || 0;
  
  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};