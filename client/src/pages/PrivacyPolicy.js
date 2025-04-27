import React from 'react';
import '../assets/css/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <h1>Privacy Policy</h1>
      
      <p>
        WebDev Tools values your privacy and is committed to protecting your personal data. 
        This Privacy Policy outlines how we collect, use, and safeguard your information.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        We collect the following types of data:
        <ul>
          <li>Data you provide voluntarily, such as feedback or contact information.</li>
          <li>Technical data such as IP address, browser type, and usage statistics, collected via cookies.</li>
        </ul>
      </p>

      <h3>2. How We Use Your Information</h3>
      <p>
        Your data is used to:
        <ul>
          <li>Enhance user experience by optimizing our tools and services.</li>
          <li>Respond to inquiries and feedback.</li>
          <li>Analyze usage patterns to improve performance.</li>
        </ul>
      </p>

      <h3>3. Data Sharing</h3>
      <p>
        We do not sell, rent, or share your personal data with third parties, except:
        <ul>
          <li>To comply with legal obligations.</li>
          <li>To prevent fraud or security breaches.</li>
        </ul>
      </p>

      <h3>4. Security Measures</h3>
      <p>
        We employ advanced security measures, including data encryption and firewalls, to protect your information.
      </p>

      <h3>5. Changes to the Privacy Policy</h3>
      <p>
        This policy may be updated periodically. You are encouraged to review it regularly to stay informed.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
