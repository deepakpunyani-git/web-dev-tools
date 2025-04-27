import React from 'react';
import '../assets/css/CallToAction.css';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="cta-api-section">
      <div className="cta-api-content">
      <h1>Start Testing Your APIs Now</h1>
<h2>Effortless JSON API Testing for Your Project</h2>
<p>
  Test and interact with your APIs in real-time with our simple JSON API Tester. 
  Whether you're using GET, POST, PUT, PATCH, or DELETE requests, this tool allows you to test your endpoints seamlessly.
  Get started today!
</p>
<Link to="/json-api-tester" className="cta-button">
  Test Your API Now
</Link>

      </div>
    </section>
  );
};

export default CallToAction;
