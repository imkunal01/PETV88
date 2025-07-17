import './App.css';
import Nav from './components/header/navbar/nav.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/layout/Home/home.jsx';
import Menu from './components/pages/menu/menu.jsx';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import HappyMeal from './components/happy-meal/HappyMeal';
import Profile from './components/profile/Profile';
import Orders from './components/orders/Orders';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useEffect, useState } from 'react';
import { fetchMenu } from '../src/api.js';

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const [menu, setMenu] = useState([]);

  // Hide navbar on specific routes
  const hideNavbarRoutes = ['/login', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenu()
      .then((data) => {
        setMenu(data);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
      });
  }, []);

  // Show loading screen if auth is initializing
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Ruko Jaraaaa...</p>
      </div>
    );
  }

  return (
    <>
      {!hideNavbar && <Nav />}

      {/* Displaying menu outside of Routes (for debug/demo purpose) */}
      <div>
        {menu.map((item) => (
          <p key={item._id}>{item.name}</p>
        ))}
      </div>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/happy-meal" element={<HappyMeal />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<h1>Oops! Something went wrong.</h1>} />
      </Routes>
    </>
  );
}

export default App;
