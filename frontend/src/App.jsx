import './App.css'
import Nav from './components/header/navbar/nav.jsx'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/layout/Home/home.jsx'
import Menu from './components/pages/menu/menu.jsx'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import HappyMeal from './components/happy-meal/HappyMeal'
import Profile from './components/profile/Profile'
import Orders from './components/orders/Orders'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Ruko Jaraaaa...</p>
      </div>
    );
  }
  const hideNavbarRoutes = ['/login', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Nav />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/menu" element={<Menu/>} />
          <Route path="/happy-meal" element={<HappyMeal/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<h1>Oops Something went </h1>} />
      </Routes>
    </>
  )
}

export default App
