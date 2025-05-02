import React, { useState  } from "react";
import { Link } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import { useLogin } from "../context/LoginContext"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useLogin();

  const handleLinkClick = () => setIsMenuOpen(false);
  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("bookmarkedTools");
    const  toolSettingsDefaults = {
      minimap: true,
      wordWrap: "off",
      tabSize: 2,
      fontSize: 14,
      insertSpaces: true,
      theme: "vs-light",
      lineNumbers: "on",
      cursorStyle: "line",
      renderIndentGuides: true,
    }
  localStorage.setItem("toolSettingsDefaults", JSON.stringify(toolSettingsDefaults));

    localStorage.removeItem("toolSettingsDefaults");
    window.dispatchEvent(new Event("storage"));
    setIsAuthenticated(false);
  };

  return (
    <>
      <header className="menu-header">
        <div className="menu-bar">
          <Link to="/" className="logo">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              className="logo-img"
            />
            WebDev Tools
          </Link>

          <div className="right-menu">
            {!isAuthenticated ? (
              <button className="menu-btn login-btn" onClick={openLoginPopup}>
                Login / Signup
              </button>
            ) : (
              <>
                <Link to="/dashboard" className="menu-btn login-btn">Dashboard</Link>
                <button className="menu-btn logout-btn" onClick={handleLogout}>Logout</button>
              </>
            )}
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className={`bi ${isMenuOpen ? "bi-x-lg" : "bi-grid"}`}></i> Tools
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="dropdown-menu-n">
            <div className="menu-section">
              <h3 className="section-title">Code Formatting and Optimization</h3>
              <ul>
                <li><Link to="/html-beautifier" onClick={handleLinkClick}>HTML Beautifier</Link></li>
                <li><Link to="/js-beautifier" onClick={handleLinkClick}>JS Beautifier</Link></li>
                <li><Link to="/css-beautifier" onClick={handleLinkClick}>CSS Beautifier</Link></li>
                <li><Link to="/js-minifier" onClick={handleLinkClick}>JS Minifier</Link></li>
                <li><Link to="/css-minifier" onClick={handleLinkClick}>CSS Minifier</Link></li>
                <li><Link to="/json-formatter" onClick={handleLinkClick}>JSON Formatter & Validator</Link></li>
              </ul>
            </div>

            <div className="menu-section">
              <h3 className="section-title">Utility Tools</h3>
              <ul>
                <li><Link to="/json-to-yaml" onClick={handleLinkClick}>JSON to YAML</Link></li>
                <li><Link to="/text-case-converter" onClick={handleLinkClick}>Text Case Converter</Link></li>
                <li><Link to="/password-checker" onClick={handleLinkClick}>Password Strength Checker</Link></li>
              </ul>
            </div>

            <div className="menu-section">
              <h3 className="section-title">Testing and SEO Tools</h3>
              <ul>
                <li><Link to="/seo-checker" onClick={handleLinkClick}>SEO Checker</Link></li>
                <li><Link to="/http-header-viewer" onClick={handleLinkClick}>HTTP Header Viewer</Link></li>
                <li><Link to="/json-api-tester" onClick={handleLinkClick}>JSON API Tester</Link></li>
              </ul>
            </div>
          </div>
        )}

        {isLoginPopupOpen && (
          <LoginPopup 
            onClose={closeLoginPopup} 
            onLoginSuccess={() => setIsAuthenticated(true)} 
          />
        )}
      </header>
    </>
  );
};

export default Header;