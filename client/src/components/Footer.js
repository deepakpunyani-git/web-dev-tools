import React, { useState, useEffect } from "react";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        {/* Logo and Tagline */}
        <div className="logo-section">
          <Link to="/" className="logo-text">
            <img className="logo-img" src={`${process.env.PUBLIC_URL}/logo.png`} alt="WebDev Tools Logo" />
            WebDev Tools
          </Link>
          <p className="tagline">Your Ultimate Toolkit for Effortless Coding.</p>
        </div>

        {/* Social Media Icons */}
        <div className="social-icons">
          <div className="icon-button">
            <Link target="_blank" rel="noopener noreferrer" to="https://www.youtube.com/">
              <FaYoutube className="icon" />
            </Link>
          </div>
          <div className="icon-button">
            <Link target="_blank" rel="noopener noreferrer" to="https://www.facebook.com/">
              <FaFacebook className="icon" />
            </Link>
          </div>
          <div className="icon-button">
            <Link target="_blank" rel="noopener noreferrer" to="https://www.instagram.com/">
              <FaInstagram className="icon" />
            </Link>
          </div>
          <div className="icon-button">
            <Link target="_blank" rel="noopener noreferrer" to="https://www.x.com/">
              <FaTwitter className="icon" />
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="Footer-links">
          <Link to="/faqs">FAQS</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/about-us">About Us</Link>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button className="scroll-to-top show" onClick={scrollToTop} aria-label="Scroll to Top">
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
