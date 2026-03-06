import './nav.css';
import logo from '../../../assets/mcdlogo.svg';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { FaUser, FaShoppingCart, FaHome, FaHamburger, FaGift, FaInfoCircle } from 'react-icons/fa';
import Cart from '../../cart/Cart';

function Nav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="mcdlogo">
          <Link to="/">
            <img src={logo} alt="McDLogo" />
          </Link>
        </div>

        <div className="navlinks">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/happy-meal">Happy Meal</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </div>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <FaUser />
                <span>{user?.name || 'User'}</span>
              </div>
              <div className="dropdown-menu">
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile bottom pill nav */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome />
          <span>Home</span>
        </Link>
        <Link to="/menu" className={`bottom-nav-item ${location.pathname === '/menu' ? 'active' : ''}`}>
          <FaHamburger />
          <span>Menu</span>
        </Link>
        <button className={`bottom-nav-item cart-tab ${itemCount > 0 ? 'has-items' : ''}`} onClick={() => setIsCartOpen(true)}>
          <FaShoppingCart />
          {itemCount > 0 && <span className="bottom-cart-badge">{itemCount}</span>}
          <span>Cart</span>
        </button>
        <Link to="/happy-meal" className={`bottom-nav-item ${location.pathname === '/happy-meal' ? 'active' : ''}`}>
          <FaGift />
          <span>Deals</span>
        </Link>
        <Link to={isAuthenticated ? '/profile' : '/login'} className={`bottom-nav-item ${['/profile', '/login', '/signup'].includes(location.pathname) ? 'active' : ''}`}>
          <FaUser />
          <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
        </Link>
      </nav>
    </div>
  );
}

export default Nav;
