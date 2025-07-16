import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, createOrder, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('Dine-In');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Calculate order totals
  const subtotal = cart.totalAmount;
  const deliveryFee = 40;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const handleGoBack = () => {
    navigate('/cart');
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmitOrder = async () => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Create a random order number
      const generatedOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderNumber(generatedOrderNumber);

      // Prepare order data
      const orderData = {
        items: cart.items,
        totalAmount: total,
        orderType,
        paymentMethod,
        orderNumber: generatedOrderNumber
      };

      // Create order in backend if user is authenticated
      await createOrder(orderData);
      
      // Clear the cart
      clearCart();
      
      // Show success
      setOrderComplete(true);
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToMenu = () => {
    navigate('/menu');
  };

  if (orderComplete) {
    return (
      <motion.div 
        className="order-success"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <FaCheck />
        </div>
        <h1>Order Confirmed!</h1>
        <p>Your order #{orderNumber} has been placed successfully.</p>
        
        {orderType === 'Dine-In' ? (
          <p>Please proceed to the counter with your order number.</p>
        ) : (
          <p>Your order will be ready for pickup in approximately 15-20 minutes.</p>
        )}
        
        <button onClick={handleReturnToMenu} className="return-btn">
          Return to Menu
        </button>
      </motion.div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button onClick={handleGoBack} className="back-btn">
          <FaArrowLeft /> Back to Cart
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <section className="order-type-section">
            <h2>Order Type</h2>
            <div className="order-type-options">
              <div 
                className={`order-option ${orderType === 'Dine-In' ? 'active' : ''}`}
                onClick={() => handleOrderTypeChange('Dine-In')}
              >
                <div className="option-radio">
                  {orderType === 'Dine-In' && <div className="radio-inner"></div>}
                </div>
                <div className="option-content">
                  <h3>Dine In</h3>
                  <p>Enjoy your meal at our restaurant</p>
                </div>
              </div>
              
              <div 
                className={`order-option ${orderType === 'Takeaway' ? 'active' : ''}`}
                onClick={() => handleOrderTypeChange('Takeaway')}
              >
                <div className="option-radio">
                  {orderType === 'Takeaway' && <div className="radio-inner"></div>}
                </div>
                <div className="option-content">
                  <h3>Takeaway</h3>
                  <p>Pick up your order at our restaurant</p>
                </div>
              </div>
            </div>
          </section>

          <section className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <div 
                className={`payment-option ${paymentMethod === 'Card' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Card')}
              >
                <div className="option-radio">
                  {paymentMethod === 'Card' && <div className="radio-inner"></div>}
                </div>
                <div className="option-content">
                  <h3>Credit/Debit Card</h3>
                  <p>Pay securely with your card</p>
                </div>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('UPI')}
              >
                <div className="option-radio">
                  {paymentMethod === 'UPI' && <div className="radio-inner"></div>}
                </div>
                <div className="option-content">
                  <h3>UPI</h3>
                  <p>Pay using UPI apps</p>
                </div>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'Cash' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodChange('Cash')}
              >
                <div className="option-radio">
                  {paymentMethod === 'Cash' && <div className="radio-inner"></div>}
                </div>
                <div className="option-content">
                  <h3>Cash</h3>
                  <p>Pay at the counter</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-items">
            {cart.items.map((item) => (
              <div key={item._id || item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleSubmitOrder} 
            className="place-order-btn"
            disabled={loading || cart.items.length === 0}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;