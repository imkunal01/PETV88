import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  FaReceipt, FaTimes, FaRedo, FaChevronRight,
  FaUtensils, FaTruck, FaClock, FaMoneyBillWave,
} from 'react-icons/fa';
import './Orders.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const STATUS_MAP = {
  pending:    { bg: '#FFF8E1', color: '#F57F17', label: 'Pending' },
  confirmed:  { bg: '#E3F2FD', color: '#1565C0', label: 'Confirmed' },
  preparing:  { bg: '#E3F2FD', color: '#1565C0', label: 'Preparing' },
  processing: { bg: '#E3F2FD', color: '#1565C0', label: 'Processing' },
  ready:      { bg: '#E8F5E9', color: '#2E7D32', label: 'Ready' },
  completed:  { bg: '#E8F5E9', color: '#2E7D32', label: 'Completed' },
  delivered:  { bg: '#E0F7FA', color: '#00838F', label: 'Delivered' },
  cancelled:  { bg: '#FFEBEE', color: '#C62828', label: 'Cancelled' },
};

const statusStyle = (s) => {
  const m = STATUS_MAP[s?.toLowerCase()] || { bg: '#f0f0f0', color: '#555', label: s };
  return { background: m.bg, color: m.color, label: m.label };
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reordering, setReordering] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/orders`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      const list = data?.orders || [];
      setOrders(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) fetchOrders(); }, [user, fetchOrders]);

  const handleReorder = async (order) => {
    try {
      setReordering(true);
      const { data } = await axios.post(
        `${API_BASE}/api/orders/reorder`,
        { orderId: order._id },
        { withCredentials: true, headers: getAuthHeaders() },
      );
      toast.success('Order placed!');
      navigate(`/order-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reorder failed');
    } finally {
      setReordering(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="mo-page mo-loading">
        <div className="mo-spinner" />
        <p>Loading orders…</p>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <motion.div className="mo-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mo-header">
        <FaReceipt className="mo-header-icon" />
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="mo-empty">
          <span className="mo-empty-icon">🍔</span>
          <h3>No orders yet</h3>
          <p>Your order history will appear here once you place your first order.</p>
          <button className="mo-btn primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      ) : (
        <div className="mo-grid">
          {orders.map((order) => {
            const st = statusStyle(order.status);
            return (
              <motion.div
                key={order._id}
                className="mo-card"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => setSelected(order)}
              >
                <div className="mo-card-top">
                  <div>
                    <span className="mo-label">Order</span>
                    <strong className="mo-order-num">#{order.orderNumber}</strong>
                  </div>
                  <span className="mo-badge" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                <div className="mo-card-meta">
                  <div><FaClock /> {formatDate(order.createdAt)}</div>
                  <div>{order.orderType === 'Takeaway' ? <FaTruck /> : <FaUtensils />} {order.orderType}</div>
                  <div><FaMoneyBillWave /> {order.paymentMethod}</div>
                </div>

                <div className="mo-card-items">
                  {order.items.slice(0, 2).map((it, i) => (
                    <span key={i}>{it.quantity}x {it.name}</span>
                  ))}
                  {order.items.length > 2 && <span className="mo-more">+{order.items.length - 2} more</span>}
                </div>

                <div className="mo-card-foot">
                  <strong className="mo-total">₹{order.total.toFixed(2)}</strong>
                  <span className="mo-view">Details <FaChevronRight /></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="mo-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="mo-modal"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mo-close" onClick={() => setSelected(null)}><FaTimes /></button>

              <div className="mo-modal-head">
                <div>
                  <h2>Order #{selected.orderNumber}</h2>
                  <span className="mo-modal-date">{formatDate(selected.createdAt)}</span>
                </div>
                {(() => { const st = statusStyle(selected.status); return (
                  <span className="mo-badge lg" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                ); })()}
              </div>

              <div className="mo-modal-info">
                <div><span>Type</span><strong>{selected.orderType}</strong></div>
                <div><span>Payment</span><strong>{selected.paymentMethod}</strong></div>
                {selected.address && <div className="mo-full"><span>Address</span><strong>{selected.address}</strong></div>}
              </div>

              <div className="mo-modal-items">
                <h3>Items</h3>
                {selected.items.map((item, i) => (
                  <div key={i} className="mo-item-row">
                    <div className="mo-item-info">
                      <span className="mo-item-name">{item.name}</span>
                      {item.options?.length > 0 && <small>{item.options.join(', ')}</small>}
                    </div>
                    <span className="mo-item-qty">x{item.quantity}</span>
                    <span className="mo-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mo-modal-totals">
                <div><span>Subtotal</span><span>₹{selected.subtotal.toFixed(2)}</span></div>
                <div><span>Tax</span><span>₹{selected.tax.toFixed(2)}</span></div>
                {selected.deliveryFee > 0 && <div><span>Delivery</span><span>₹{selected.deliveryFee.toFixed(2)}</span></div>}
                {selected.discount > 0 && <div className="mo-discount"><span>Discount</span><span>-₹{selected.discount.toFixed(2)}</span></div>}
                <div className="mo-grand"><span>Total</span><span>₹{selected.total.toFixed(2)}</span></div>
              </div>

              <div className="mo-modal-actions">
                <button className="mo-btn primary" onClick={() => handleReorder(selected)} disabled={reordering}>
                  <FaRedo /> {reordering ? 'Placing…' : 'Reorder'}
                </button>
                <button className="mo-btn ghost" onClick={() => setSelected(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Orders;