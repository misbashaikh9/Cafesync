import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);



  // Load cart from backend only
  const loadCartFromBackend = async () => {
    if (!token) {
      console.log('[CartContext] No token, setting empty cart');
      setCart([]);
      return;
    }

    try {
      console.log('[CartContext] Loading cart from backend...');
      console.log('[CartContext] Token:', token ? 'Token exists' : 'No token');
      
      setCartLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[CartContext] Response status:', response.status);
      console.log('[CartContext] Response ok:', response.ok);

      if (response.ok) {
        const cartData = await response.json();
        console.log('[CartContext] Raw cart data:', cartData);
        
        const cleanCart = cartData.items?.map(item => {
          console.log('[CartContext] Cart item:', item);
          console.log('[CartContext] Product ID from item:', item.productId?._id);
          console.log('[CartContext] Product data:', item.productId);
          
          return {
            ...item.productId,
            quantity: item.quantity,
            _id: item.productId?._id || item.productId?.id
          };
        }) || [];
        
        console.log('[CartContext] Cleaned cart data:', cleanCart);
        setCart(cleanCart);
        console.log('[CartContext] Loaded cart from backend:', cleanCart);
      } else {
        const errorData = await response.text();
        console.error('[CartContext] Failed to load cart from backend:', response.status);
        console.error('[CartContext] Error response:', errorData);
        setCart([]);
      }
    } catch (error) {
      console.error('[CartContext] Error loading cart from backend:', error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Load cart from backend when user logs in
  useEffect(() => {
    if (token) {
      loadCartFromBackend();
    } else {
      setCart([]);
    }
  }, [token]);

  // No localStorage saving - everything goes to backend

  // No need for sync useEffect - all operations are immediate backend calls

  // Add product to cart (backend operation)
  const addToCart = async (product) => {
    if (!token) {
      console.log('[CartContext] User not authenticated, cannot add to cart');
      return;
    }

    try {
      console.log('[CartContext] Adding product to cart:', product);
      console.log('[CartContext] Product ID:', product._id);
      console.log('[CartContext] Token:', token ? 'Token exists' : 'No token');
      
      // Check if product already exists in cart
      const productId = product._id || product.id;
      console.log('[CartContext] Using product ID:', productId);
      
      const existing = cart.find(item => item._id === productId);
      
      if (existing) {
        console.log('[CartContext] Product already exists, updating quantity');
        // Update quantity
        await updateQuantity(productId, existing.quantity + 1);
      } else {
        console.log('[CartContext] Adding new product to backend');
        // Add new product
        const requestBody = { 
          productId: productId, 
          quantity: 1 
        };
        console.log('[CartContext] Request body:', requestBody);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        });

        console.log('[CartContext] Response status:', response.status);
        console.log('[CartContext] Response ok:', response.ok);

        if (response.ok) {
          const responseData = await response.json();
          console.log('[CartContext] Response data:', responseData);
          
          // Reload cart from backend to get updated state
          await loadCartFromBackend();
          console.log('[CartContext] Product added to cart successfully');
        } else {
          const errorData = await response.text();
          console.error('[CartContext] Failed to add product to cart:', response.status);
          console.error('[CartContext] Error response:', errorData);
        }
      }
    } catch (error) {
      console.error('[CartContext] Error adding product to cart:', error);
    }
  };

  // Remove product from cart (backend operation)
  const removeFromCart = async (productId) => {
    if (!token) {
      console.log('[CartContext] User not authenticated, cannot remove from cart');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Reload cart from backend to get updated state
        await loadCartFromBackend();
        console.log('[CartContext] Product removed from cart successfully');
      } else {
        console.error('[CartContext] Failed to remove product from cart:', response.status);
      }
    } catch (error) {
      console.error('[CartContext] Error removing product from cart:', error);
    }
  };

  // Update quantity (backend operation)
  const updateQuantity = async (productId, quantity) => {
    if (!token) {
      console.log('[CartContext] User not authenticated, cannot update quantity');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        // Reload cart from backend to get updated state
        await loadCartFromBackend();
        console.log('[CartContext] Quantity updated successfully');
      } else {
        console.error('[CartContext] Failed to update quantity:', response.status);
      }
    } catch (error) {
      console.error('[CartContext] Error updating quantity:', error);
    }
  };

  // Clear cart (backend operation)
  const clearCart = async () => {
    if (!token) {
      console.log('[CartContext] User not authenticated, cannot clear cart');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCart([]);
        console.log('[CartContext] Cart cleared from backend successfully');
      } else {
        console.error('[CartContext] Failed to clear cart from backend:', response.status);
      }
    } catch (error) {
      console.error('[CartContext] Error clearing cart from backend:', error);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartLoading, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      refreshCart: loadCartFromBackend 
    }}>
      {children}
    </CartContext.Provider>
  );
}; 