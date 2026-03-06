import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './MenuItem.css';

const MenuItem = ({ item, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(0);

  const handleAdd = () => {
    setAdded(true);
    setQty(1);
    onAddToCart(item);
  };

  const handleIncrement = () => {
    setQty(prev => prev + 1);
    onAddToCart(item);
  };

  const handleDecrement = () => {
    if (qty <= 1) {
      setQty(0);
      setAdded(false);
    } else {
      setQty(prev => prev - 1);
    }
  };

  return (
    <motion.div 
      className="menu-item"
      whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.25 }}
    >
      {/* Veg / Non-veg indicator */}
      <span className={`food-type-badge ${item.isVegetarian ? 'veg' : 'non-veg'}`}>
        <span className="dot" />
      </span>

      {item.isPopular && <span className="popular-badge">Bestseller</span>}

      <div className="item-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>

      <div className="item-details">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-description">{item.description}</p>

        <div className="item-footer">
          <span className="item-price">₹{item.price}</span>

          <AnimatePresence mode="wait">
            {!added ? (
              <motion.button
                key="add"
                className="add-btn"
                onClick={handleAdd}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                whileTap={{ scale: 0.92 }}
              >
                ADD
              </motion.button>
            ) : (
              <motion.div
                key="qty"
                className="qty-control"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <button className="qty-btn" onClick={handleDecrement}><FaMinus /></button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={handleIncrement}><FaPlus /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;



