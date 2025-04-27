import React from 'react';
import '../assets/css/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="promo-banner">
          <h1>WEB DEV TOOLS</h1>
          <h2>Everything You Need</h2>
          <p>Enhance your productivity with our all-in-one toolkit</p>
          <p className="cta">Start Building Today</p>
        </div>
      </div>
      <div className="info-grid">
        <div className="info-item pink">10+<br /><span>CODE TOOLS</span></div>
        <div className="info-item purple">2+<br /><span>CONVERTERS</span></div>
        <div className="info-item yellow">3+<br /><span>UTILITY TOOLS</span></div>
        <div className="info-item blue">3+<br /><span>TESTING TOOLS</span></div>
      </div>
    </section>
  );
};

export default HeroSection;
