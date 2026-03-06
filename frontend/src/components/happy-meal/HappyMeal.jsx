import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCartPlus, FaPercent, FaStar, FaGift, FaChild } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import './HappyMeal.css';

import happyMealImg1 from '../../assets/happy-meal-1.svg';
import happyMealImg2 from '../../assets/happy-meal-2.svg';
import happyMealImg3 from '../../assets/happy-meal-3.svg';
import happyMealImg4 from '../../assets/happy-meal-4.svg';

const happyMealOffers = [
  {
    id: 'hm1',
    name: 'Kids Happy Meal with Toy',
    description: 'Includes burger, small fries, drink, and a surprise toy!',
    price: 199,
    originalPrice: 249,
    image: happyMealImg1,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    badge: 'Popular',
    badgeIcon: <FaStar />,
    color: '#ff6b08',
  },
  {
    id: 'hm2',
    name: 'Family Combo Meal',
    description: '2 burgers, 2 happy meals, 2 medium fries, and 4 drinks.',
    price: 599,
    originalPrice: 699,
    image: happyMealImg2,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    badge: 'Limited Time',
    badgeIcon: <FaClock />,
    color: '#da291c',
  },
  {
    id: 'hm3',
    name: 'Birthday Party Pack',
    description: '5 happy meals, party decorations, and birthday surprise.',
    price: 999,
    originalPrice: 1299,
    image: happyMealImg3,
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    badge: 'Best Value',
    badgeIcon: <FaPercent />,
    color: '#ffbc0d',
  },
  {
    id: 'hm4',
    name: 'Veg Happy Meal',
    description: 'Veg burger, small fries, drink, and a surprise toy!',
    price: 179,
    originalPrice: 219,
    image: happyMealImg4,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    badge: 'New',
    badgeIcon: <FaGift />,
    color: '#0a8d27',
  },
];

const HappyMeal = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const updated = {};
      happyMealOffers.forEach(o => {
        const diff = o.endDate - now;
        updated[o.id] = diff > 0
          ? { d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60) }
          : { d: 0, h: 0, m: 0 };
      });
      setTimeLeft(updated);
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, []);

  const handleAdd = (offer) => {
    addToCart({ _id: offer.id, name: offer.name, price: offer.price, image: offer.image, description: offer.description });
  };

  return (
    <div className="hm-page">
      {/* Hero Banner */}
      <section className="hm-hero">
        <motion.div className="hm-hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="hm-hero-badge">LIMITED TIME</span>
          <h1>Happy Meal<sup>&reg;</sup> Deals</h1>
          <p>Exclusive combos, surprise toys & family-sized savings.</p>
        </motion.div>
        <div className="hm-hero-decor" />
      </section>

      {/* Deals Grid */}
      <section className="hm-deals">
        <div className="hm-deals-inner">
          <motion.h2 
            className="hm-section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >Today's Deals</motion.h2>

          <div className="hm-deals-grid">
            {happyMealOffers.map((offer, i) => {
              const save = offer.originalPrice - offer.price;
              const t = timeLeft[offer.id];
              return (
                <motion.div
                  key={offer.id}
                  className="deal-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,0,0,0.14)" }}
                >
                  {/* Badge */}
                  <div className="deal-badge" style={{ background: offer.color }}>
                    {offer.badgeIcon} {offer.badge}
                  </div>

                  {/* Image */}
                  <div className="deal-img-wrap" style={{ background: `${offer.color}12` }}>
                    <img src={offer.image} alt={offer.name} />
                  </div>

                  {/* Content */}
                  <div className="deal-body">
                    <h3>{offer.name}</h3>
                    <p className="deal-desc">{offer.description}</p>

                    {/* Price row */}
                    <div className="deal-price-row">
                      <span className="deal-price">&#8377;{offer.price}</span>
                      <span className="deal-mrp">&#8377;{offer.originalPrice}</span>
                      <span className="deal-save">Save &#8377;{save}</span>
                    </div>

                    {/* Timer */}
                    <div className="deal-timer">
                      <FaClock />
                      <div className="timer-units">
                        <span className="tu">{t?.d ?? 0}<small>d</small></span>
                        <span className="tu">{t?.h ?? 0}<small>h</small></span>
                        <span className="tu">{t?.m ?? 0}<small>m</small></span>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="deal-add-btn" onClick={() => handleAdd(offer)}>
                      <FaCartPlus /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Happy Meals */}
      <section className="hm-why">
        <div className="hm-why-inner">
          <motion.h2 
            className="hm-section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >Why Kids Love Happy Meals</motion.h2>
          <div className="hm-why-grid">
            {[
              { icon: <FaGift style={{ color: '#ff6b08' }} />, bg: '#fff3e0', title: 'Surprise Toys', desc: 'Collectible toys from favourite movies & shows every month.' },
              { icon: <FaChild style={{ color: '#0a8d27' }} />, bg: '#e8f5e9', title: 'Kid-Friendly Portions', desc: 'Perfectly sized for little tummies with balanced nutrition.' },
              { icon: <FaStar style={{ color: '#da291c' }} />, bg: '#fce4ec', title: 'Trusted by Families', desc: 'Loved by millions of families across India since 1996.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="why-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              >
                <div className="why-icon" style={{ background: card.bg }}>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HappyMeal;
