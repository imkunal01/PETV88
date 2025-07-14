import React from 'react';
import './Home.css';
import mealImage from '../../../assets/ranveer.png'; // use the exact promo image

const Home = () => {
  return (
    <section className="home-banner">
      {/* Left side */}
      <div className="home-left">
        <div className="text-wrapper">
          <h1>
            <span className="text-outline">The</span><br />
            <span className="text-solid">Happy Meal</span>
          </h1>

          <div className="arrows">
            <button className="arrow outline">{'<'}</button>
            <button className="arrow filled">{'>'}</button>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="home-right">
        <img src={mealImage} alt="Ranveer Singh Meal" className="promo-image" />
        <div className="availability">
          <h2>Available Now</h2>
          <p><span className="icon">⏱</span> LIMITED TIME OFFER</p>
        </div>
      </div>
    </section>
  );
};

export default Home;