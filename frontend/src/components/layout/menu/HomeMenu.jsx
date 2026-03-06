import React, { useState, useEffect } from 'react';
import './HomeMenu.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../../context/CartContext';
import burger1 from '../../../assets/veg.png';
import burger2 from '../../../assets/mcaloo-tikki.png';
import burger3 from '../../../assets/mcchicken.png';
import burger4 from '../../../assets/mcveggie.png';
import burger5 from '../../../assets/butter-chicken.png';

const meals = [
  { _id: 'b1', name: 'Veg Surprise Burger', price: 129, image: burger1, tag: 'Veg', description: 'Italian herb sauce & shredded onion potato patty.' },
  { _id: 'b2', name: 'McAloo Tikki Burger', price: 149, image: burger2, tag: 'Veg', description: 'Aloo tikki patty with tangy sauces & crisp veggies.' },
  { _id: 'b3', name: 'McChicken Burger', price: 199, image: burger3, tag: 'Non-Veg', description: 'Juicy chicken patty with creamy mayo & lettuce.' },
  { _id: 'b4', name: 'McVeggie Burger', price: 179, image: burger4, tag: 'Veg', description: 'Potatoes, peas, carrots & beans, spiced & crumb-coated.' },
  { _id: 'b5', name: 'Butter Chicken Grilled', price: 229, image: burger5, tag: 'Non-Veg', description: 'Grilled chicken with creamy butter chicken sauce.' },
];

const HomeMenu = () => {
  const [active, setActive] = useState(0);
  const { addToCart } = useCart();

  const next = () => setActive(p => (p + 1) % meals.length);
  const prev = () => setActive(p => (p - 1 + meals.length) % meals.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, []);

  const handleAdd = (meal) => {
    addToCart({ _id: meal._id, name: meal.name, price: meal.price, image: meal.image, description: meal.description });
  };

  const cur = meals[active];

  return (
    <section className="hm-section">
      <div className="hm-inner">
        {/* Header */}
        <div className="hm-top">
          <div>
            <h2 className="hm-heading">Our Bestsellers</h2>
            <p className="hm-sub">Loved by millions across India</p>
          </div>
          <Link to="/menu" className="hm-view-all">View Full Menu &rarr;</Link>
        </div>

        {/* Featured Spotlight */}
        <div className="hm-spotlight">
          <button className="hm-arrow hm-arrow-left" onClick={prev}><FaChevronLeft /></button>

          <AnimatePresence mode="wait">
            <motion.div
              key={cur._id}
              className="hm-featured"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="hm-featured-img">
                <img src={cur.image} alt={cur.name} />
              </div>
              <div className="hm-featured-info">
                <span className={`hm-tag ${cur.tag === 'Veg' ? 'veg' : 'nonveg'}`}>{cur.tag}</span>
                <h3>{cur.name}</h3>
                <p>{cur.description}</p>
                <div className="hm-featured-bottom">
                  <span className="hm-price">&#8377;{cur.price}</span>
                  <button className="hm-add-btn" onClick={() => handleAdd(cur)}>
                    <FaShoppingCart /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="hm-arrow hm-arrow-right" onClick={next}><FaChevronRight /></button>
        </div>

        {/* Dots */}
        <div className="hm-dots">
          {meals.map((_, i) => (
            <button key={i} className={`hm-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
          ))}
        </div>

        {/* Quick-pick grid */}
        <div className="hm-grid">
          {meals.map((m, i) => (
            <motion.div
              key={m._id}
              className={`hm-card ${i === active ? 'selected' : ''}`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -4 }}
              onClick={() => setActive(i)}
            >
              <img src={m.image} alt={m.name} />
              <span className="hm-card-name">{m.name}</span>
              <span className="hm-card-price">&#8377;{m.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeMenu;
