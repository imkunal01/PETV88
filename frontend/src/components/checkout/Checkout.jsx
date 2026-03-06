import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaUtensils, FaTruck, FaMoneyBillWave, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import './Checkout.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const TAX_RATE = 0.18;
const DELIVERY_FEE = 40;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=review, 2=details, 3=confirm
  const [orderType, setOrderType] = useState('Dine-In');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tax = cartTotal * TAX_RATE;
  const delivery = orderType === 'Takeaway' ? DELIVERY_FEE : 0;
  const total = cartTotal + tax + delivery;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/menu');
    }
  }, [isAuthenticated, cartItems, navigate]);

  const handlePlaceOrder = async () => {
    if (orderType === 'Takeaway' && !address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    try {
      setIsLoading(true);
      const orderData = {
        orderType,
        paymentMethod: 'Cash',
        address: orderType === 'Takeaway' ? address : '',
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: [],
          specialInstructions: '',
        })),
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to place order');

      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-success/${data.order._id}`);
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Review' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Confirm' },
  ];

  return (
    <div className="ck-page">
      <div className="ck-container">
        {/* Back + Title */}
        <div className="ck-top">
          <button className="ck-back" onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}>
            <FaArrowLeft /> Back
          </button>
          <h1>Checkout</h1>
        </div>

        {/* Progress */}
        <div className="ck-progress">
          {steps.map((s) => (
            <div key={s.num} className={`ck-step ${step >= s.num ? 'active' : ''} ${step === s.num ? 'current' : ''}`}>
              <div className="ck-step-circle">{s.num}</div>
              <span>{s.label}</span>
            </div>
          ))}
          <div className="ck-progress-line">
            <div className="ck-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" className="ck-step-content" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <h2><FaShoppingBag /> Order Summary</h2>
              <div className="ck-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="ck-item">
                    <div className="ck-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="ck-item-info">
                      <h4>{item.name}</h4>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="ck-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="ck-pricing">
                <div className="ck-price-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
                <div className="ck-price-row"><span>Tax (18%)</span><span>₹{tax.toFixed(2)}</span></div>
                {delivery > 0 && <div className="ck-price-row"><span>Delivery Fee</span><span>₹{delivery.toFixed(2)}</span></div>}
                <div className="ck-price-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              </div>
              <button className="ck-next-btn" onClick={() => setStep(2)}>Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" className="ck-step-content" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <h2>Order Details</h2>

              <div className="ck-type-selector">
                <label className="ck-type-card" data-selected={orderType === 'Dine-In'} onClick={() => setOrderType('Dine-In')}>
                  <FaUtensils className="ck-type-icon" />
                  <span>Dine-In</span>
                  <small>Eat at restaurant</small>
                </label>
                <label className="ck-type-card" data-selected={orderType === 'Takeaway'} onClick={() => setOrderType('Takeaway')}>
                  <FaTruck className="ck-type-icon" />
                  <span>Takeaway</span>
                  <small>Delivery to your door</small>
                </label>
              </div>

              <AnimatePresence>
                {orderType === 'Takeaway' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ck-address-wrap">
                    <label htmlFor="address">Delivery Address</label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full delivery address"
                      rows={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="ck-payment-info">
                <FaMoneyBillWave />
                <div>
                  <strong>Cash on Delivery / Counter</strong>
                  <small>Pay when you receive your order</small>
                </div>
              </div>

              <button className="ck-next-btn" onClick={() => {
                if (orderType === 'Takeaway' && !address.trim()) {
                  toast.error('Please enter a delivery address');
                  return;
                }
                setStep(3);
              }}>
                Review Order
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" className="ck-step-content" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <h2>Confirm Your Order</h2>

              <div className="ck-confirm-card">
                <div className="ck-confirm-row"><span>Order Type</span><strong>{orderType}</strong></div>
                <div className="ck-confirm-row"><span>Payment</span><strong>Cash</strong></div>
                <div className="ck-confirm-row"><span>Items</span><strong>{cartItems.reduce((c, i) => c + i.quantity, 0)} item(s)</strong></div>
                {orderType === 'Takeaway' && <div className="ck-confirm-row"><span>Delivery</span><strong>{address}</strong></div>}
                <div className="ck-confirm-row total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
              </div>

              <motion.button
                className="ck-place-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? <><span className="ck-spinner" /> Processing...</> : 'Place Order'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;