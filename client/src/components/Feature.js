import React from 'react';
import '../assets/css/Features.css';

const KeyFeatures = () => {
  return (
    <section className="key-features">
      <div className="section-header">
        <h2>Key Features</h2>
        <p>Discover what makes us unique</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="icon">
            <i className="fas fa-cogs"></i>
          </div>
          <h3>Powerful Tools</h3>
          <p>
            Our tools are designed to save you time and improve your workflow.
            From beautifiers to validators, we have everything you need.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>High Security</h3>
          <p>
            With built-in security measures, we ensure your data is safe and
            protected while you use our tools.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>Community Driven</h3>
          <p>
            Our platform is powered by feedback from developers like you. Join
            a growing community to improve the tools further.
          </p>
        </div>
        <div className="feature-card">
          <div className="icon">
            <i className="fas fa-mobile-alt"></i>
          </div>
          <h3>Mobile Friendly</h3>
          <p>
            Our tools are fully responsive and work seamlessly on all devices.
            You can access them anywhere, anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
