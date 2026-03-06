import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_KEY = 'mcd_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cartItems.reduce((c, i) => c + i.quantity, 0);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((c) => c._id === item._id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        toast.success(`Added another ${item.name}`);
        return updated;
      }
      toast.success(`${item.name} added to cart`);
      return [...prev, { _id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
    toast.success('Item removed');
  }, []);

  const incrementQuantity = useCallback((itemId) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decrementQuantity = useCallback((itemId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i._id === itemId);
      if (item && item.quantity === 1) return prev.filter((i) => i._id !== itemId);
      return prev.map((i) => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
    });
  }, []);

  const updateQuantity = useCallback((itemId, qty) => {
    if (qty < 1) {
      setCartItems((prev) => prev.filter((i) => i._id !== itemId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;