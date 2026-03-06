import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaListAlt, FaHome, FaUtensils } from 'react-icons/fa';
import './ordersuccess.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
          credentials: 'include',
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to fetch order');
        }
        setOrder(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="os-page os-loading">
        <div className="os-loader" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="os-page os-error">
        <div className="os-error-icon">❌</div>
        <h2>{error || 'Order not found'}</h2>
        <button onClick={() => navigate('/menu')} className="os-btn secondary">Back to Menu</button>
      </div>
    );
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const estTime = () => {
    if (order.estimatedDeliveryTime) return formatDate(order.estimatedDeliveryTime);
    const t = new Date(order.createdAt);
    t.setMinutes(t.getMinutes() + (order.orderType === 'Takeaway' ? 30 : 15));
    return formatDate(t);
  };

  return (
    <div className="os-page">
      {/* Confetti dots */}
      <div className="os-confetti" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="os-dot" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            background: ['#DA291C', '#FFC72C', '#FF5C00', '#4CAF50', '#2196F3'][i % 5],
          }} />
        ))}
      </div>

      <motion.div className="os-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Success header */}
        <motion.div className="os-hero" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}>
          <div className="os-check"><FaCheckCircle /></div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          Order Placed!
        </motion.h1>
        <p className="os-subtitle">Thank you! Your order is being prepared.</p>

        {/* Info grid */}
        <div className="os-info-grid">
          <div><span>Order #</span><strong>{order.orderNumber}</strong></div>
          <div><span>Date</span><strong>{formatDate(order.createdAt)}</strong></div>
          <div><span>Type</span><strong>{order.orderType}</strong></div>
          <div><span>Status</span><strong className="os-status-badge">{order.status}</strong></div>
          <div><span>{order.orderType === 'Takeaway' ? 'Est. Delivery' : 'Pickup Time'}</span><strong>{estTime()}</strong></div>
          <div><span>Payment</span><strong>{order.paymentMethod} · <span className={`os-pay-badge ${order.paymentStatus?.toLowerCase()}`}>{order.paymentStatus}</span></strong></div>
        </div>

        {/* Items */}
        <div className="os-items-section">
          <h3>Order Summary</h3>
          <div className="os-items">
            {order.items.map((item, i) => (
              <div key={i} className="os-item-row">
                <span className="os-item-name">{item.name}</span>
                <span className="os-item-qty">x{item.quantity}</span>
                <span className="os-item-price">₹{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="os-totals">
            <div className="os-total-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="os-total-row"><span>Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
            {order.deliveryFee > 0 && <div className="os-total-row"><span>Delivery</span><span>₹{order.deliveryFee.toFixed(2)}</span></div>}
            {order.discount > 0 && <div className="os-total-row discount"><span>Discount</span><span>-₹{order.discount.toFixed(2)}</span></div>}
            <div className="os-total-row grand"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="os-actions">
          <button className="os-btn primary" onClick={() => navigate('/orders')}><FaListAlt /> My Orders</button>
          <button className="os-btn secondary" onClick={() => navigate('/menu')}><FaUtensils /> Order More</button>
          <button className="os-btn ghost" onClick={() => navigate('/')}><FaHome /> Home</button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;