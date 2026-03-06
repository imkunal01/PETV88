import React from 'react';
import './about.css';
import { motion } from 'framer-motion';
import { FaHamburger, FaLeaf, FaUsers, FaMobileAlt, FaStore, FaHeart } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

const About = () => {
  return (
    <div className="about-wrapper">
      {/* Hero */}
      <section className="about-hero">
        <motion.div className="about-hero-inner" initial="hidden" animate="visible" variants={fadeUp}>
          <span className="about-badge">Est. 1955</span>
          <h1>Golden Moments,<br />Every Day</h1>
          <p>Where crispy fries meet warm smiles — it's not just a meal, it's a mood.</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        {[
          { num: '36,000+', label: 'Restaurants Worldwide' },
          { num: '100+', label: 'Countries Served' },
          { num: '69M+', label: 'Customers Daily' },
          { num: '30+', label: 'Years in India' },
        ].map((s, i) => (
          <motion.div className="about-stat" key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <strong>{s.num}</strong>
            <span>{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Story */}
      <section className="about-story">
        <motion.div className="about-story-inner" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2>From Global to Local</h2>
          <div className="about-story-grid">
            <div className="about-story-text">
              <p>
                What began as a humble burger joint in the U.S. is now a sensation across India.
                We've blended international quality with regional flavors — think McAloo Tikki, Masala McEgg, and Maharaja Mac.
              </p>
              <p>
                We believe in serving food that feels personal. Our chefs draw inspiration from your taste buds — spicy, tangy, and satisfying.
              </p>
            </div>
            <div className="about-story-visual">
              <div className="about-color-block red" />
              <div className="about-color-block yellow" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="about-features">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>The Experience</motion.h2>
        <div className="about-features-grid">
          {[
            { icon: <FaHamburger />, title: 'Crafted Burgers', desc: 'Made with care, every single time.' },
            { icon: <FaStore />, title: 'Cozy Spaces', desc: 'Comfy seating for endless conversations.' },
            { icon: <FaMobileAlt />, title: 'Smart Ordering', desc: 'Order via app and self-serve kiosks.' },
            { icon: <FaUsers />, title: 'Family Friendly', desc: 'Perfect for weekends or solo sessions.' },
            { icon: <FaLeaf />, title: 'Eco Responsible', desc: 'Local farmers, eco-friendly packaging.' },
            { icon: <FaHeart />, title: 'Made with Love', desc: 'Every order, every smile — for you.' },
          ].map((f, i) => (
            <motion.div className="about-feature-card" key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="about-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <motion.div className="about-cta-inner" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2>You're Part of the Story</h2>
          <p>
            Whether it's your first bite or a late-night drive-thru order,
            every visit is a memory. We're here to make it special.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
