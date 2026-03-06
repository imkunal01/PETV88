import React from 'react';
import { motion } from 'framer-motion';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory, isVegOnly, setIsVegOnly }) => {
  return (
    <div className="filter-bar">
      <div className="categories-scroll">
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`cat-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <label className="veg-toggle">
        <span className="veg-toggle-icon">●</span>
        <span className="veg-toggle-label">Veg</span>
        <div className={`toggle-track ${isVegOnly ? 'on' : ''}`} onClick={() => setIsVegOnly(!isVegOnly)}>
          <div className="toggle-thumb" />
        </div>
      </label>
    </div>
  );
};

export default CategoryFilter;