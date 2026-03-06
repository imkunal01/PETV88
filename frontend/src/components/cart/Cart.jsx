import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaMinus, FaPlus, FaTrashAlt, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import './Cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, cartTotal, itemCount, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleBrowse = () => {
    onClose();
    navigate('/menu');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <div className="cart-drawer-title">
                <FaShoppingBag />
                <h2>Your Cart</h2>
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </div>
              <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
                <FaTimes />
              </button>
            </div>

            {cartItems.length === 0 ? (
              /* Empty state */
              <div className="cart-empty">
                <div className="cart-empty-icon">🍔</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items yet. Explore our menu!</p>
                <button className="cart-browse-btn" onClick={handleBrowse}>
                  Browse Menu <FaArrowRight />
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="cart-items-list">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className="cart-item-card"
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="cart-item-img">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="cart-item-info">
                          <h4>{item.name}</h4>
                          <span className="cart-item-price">₹{item.price}</span>
                          <div className="cart-qty-controls">
                            <button onClick={() => decrementQuantity(item._id)} aria-label="Decrease">
                              <FaMinus />
                            </button>
                            <span className="cart-qty">{item.quantity}</span>
                            <button onClick={() => incrementQuantity(item._id)} aria-label="Increase">
                              <FaPlus />
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-right">
                          <span className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                          <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} aria-label="Remove">
                            <FaTrashAlt />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="cart-drawer-footer">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <span className="cart-subtotal-price">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="cart-tax-note">Tax & delivery calculated at checkout</p>
                  <div className="cart-footer-actions">
                    <button className="cart-clear-btn" onClick={clearCart}>Clear</button>
                    <button className="cart-checkout-btn" onClick={handleCheckout}>
                      Checkout <FaArrowRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;