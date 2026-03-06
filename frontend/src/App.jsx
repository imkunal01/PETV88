import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Nav from "./components/header/navbar/nav.jsx";
import Home from "./components/layout/Home/home.jsx";
import Menu from "./components/pages/menu/menu.jsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import HappyMeal from "./components/happy-meal/HappyMeal";
import Profile from "./components/profile/Profile";
import Orders from "./components/orders/Orders";
import Checkout from "./components/checkout/Checkout";
import OrderSuccess from "./components/order/ordersuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import mcdgif from "./assets/mcgif.gif";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import About from "./components/pages/about/about.jsx";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const PT = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ width: "100%" }}>
    {children}
  </motion.div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="fry-animation">
          <div className="fry-box">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="fry"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>

       
        <img
          src={mcdgif}
          alt="McDonald's Fries"
          className="mcd-fries-gif"
        />

        <p className="loading-text">Cooking Your Meal...</p>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <CartProvider>
        {!hideNavbar && <Nav />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PT><Home /></PT>} />
          <Route path="/login" element={<PT><Login /></PT>} />
          <Route path="/signup" element={<PT><Signup /></PT>} />
          <Route path="/happy-meal" element={<PT><HappyMeal /></PT>} />
          <Route path="/about" element={<PT><About /></PT>} />
          <Route path="/menu" element={<PT><Menu /></PT>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<PT><Profile /></PT>} />
            <Route path="/orders" element={<PT><Orders /></PT>} />
            <Route path="/checkout" element={<PT><Checkout /></PT>} />
            <Route path="/order-success/:orderId" element={<PT><OrderSuccess /></PT>} />
          </Route>

          <Route path="*" element={<PT><h1>Oops! Page Not Found</h1></PT>} />
          </Routes>
        </AnimatePresence>
      </CartProvider>
    </>
  );
}

export default App;
