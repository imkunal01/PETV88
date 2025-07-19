import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
  return (
    <motion.div 
      className="not-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>Looks like this page is as rare as our secret sauce recipe!</p>
        <div className="not-found-actions">
          <Link to="/" className="home-button">
            Return to Home
          </Link>
          <Link to="/menu" className="menu-button">
            View Menu
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;