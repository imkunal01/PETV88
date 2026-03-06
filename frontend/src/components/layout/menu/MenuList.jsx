import React from 'react';
import { motion } from 'framer-motion';
import MenuItem from './MenuItem';
import './MenuList.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

const MenuList = ({ items, onAddToCart }) => {
  return (
    <motion.div 
      className="menu-items"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={items.map(i => i._id).join(',')}
    >
      {items.length > 0 ? (
        items.map(item => (
          <motion.div key={item._id} variants={itemVariants}>
            <MenuItem 
              item={item}
              onAddToCart={onAddToCart}
            />
          </motion.div>
        ))
      ) : (
        <div className="no-items-message">
          <h3>No items found</h3>
          <p>Try changing your filters or check back later for more options.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MenuList;