import React, { useState } from "react";
import { FaLightbulb } from "react-icons/fa"; 

const RequestMoreFeatures = () => {
  
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    const email = "support@webdev.com";
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  return (
    <div className="req-main">
    <section className="request-more-section">
      <div className="request-content">
        <div className="icon-wrapper">
          <FaLightbulb className="feature-icon" />
        </div>
        <h2 className="request-title">Have an Idea? Request More Features!</h2>
        <p className="request-description">
          We’re constantly looking to improve and provide the best tools for you.
          If there’s a feature you’d like to see, we’re all ears! Share your ideas
          with us and help shape the future of our platform.
        </p>
        <p className="email-address">
          📧 Email us at:{" "}
          <strong onClick={handleCopyEmail} className="copy-email">
            support@webdev.com
          </strong>
        </p>
        {copied && <p className="copied-message">Email copied to clipboard!</p>}
      </div>
    </section></div>
  );
};

export default RequestMoreFeatures;
