import React from 'react';
import '../assets/css/FAQs.css';

const FAQs = () => {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      
      <div className="faq-item">
        <h3>What is WebDev Tools?</h3>
        <p>
          WebDev Tools is a suite of free online tools designed to make life easier for developers. 
          It includes features like code beautification, optimization, validation, and format conversion.
        </p>
      </div>
      
      <div className="faq-item">
        <h3>Do I need to sign up to use the tools?</h3>
        <p>
          No, all tools are available for free without requiring any sign-up. However, creating an account 
          allows you to save your preferences and access personalized features.
        </p>
      </div>
      
      <div className="faq-item">
        <h3>Are my uploaded files secure?</h3>
        <p>
          Yes. WebDev Tools processes most files locally in your browser, ensuring they never leave your device. 
          For features that require server-side processing, all files are securely deleted after processing.
        </p>
      </div>
      
      <div className="faq-item">
        <h3>Can I suggest new tools?</h3>
        <p>
          Absolutely! We welcome suggestions. Visit our <a href="/about-us">About Us</a> page to find our contact information 
          or submit a suggestion through the feedback form.
        </p>
      </div>
      
      <div className="faq-item">
        <h3>What browsers are supported?</h3>
        <p>
          WebDev Tools is optimized for modern browsers, including Chrome, Firefox, Edge, and Safari. 
          We recommend updating your browser to the latest version for the best experience.
        </p>
      </div>
      
      <div className="faq-item">
        <h3>Is WebDev Tools free for commercial use?</h3>
        <p>
          Yes, you can use WebDev Tools for both personal and commercial projects without any restrictions.
        </p>
      </div>
    </div>
  );
};

export default FAQs;
