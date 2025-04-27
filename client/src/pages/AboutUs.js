import React from 'react';
import '../assets/css/AboutUs.css';

const AboutUs = () => {
  return (
<div className="about-container">
      <h1>About Us</h1>
      
      <p>
        Welcome to WebDev Tools! We are a team of passionate developers committed to creating tools 
        that simplify web development tasks.
      </p>

      <h3>Our Mission</h3>
      <p>
        Our mission is to provide developers with fast, reliable, and easy-to-use tools for code 
        optimization, validation, and conversion.
      </p>

      <h3>Our Story</h3>
      <p>
        WebDev Tools was born from the challenges we faced during our own development projects. 
        Our goal was to create a centralized hub of tools to save time and effort.
      </p>

      <h3>Contact Us</h3>
      <p>
        Have questions or feedback? Reach out to us at <a href="mailto:support@webdevtools.com">support@webdevtools.com</a>.
      </p>

      <h3>Follow Us</h3>
      <p>
        Stay updated with our latest features and updates:
        <ul>
          <li><a href="/">Twitter</a></li>
          <li><a href="/">GitHub</a></li>
        </ul>
      </p>
    </div>
  );
};

export default AboutUs;
