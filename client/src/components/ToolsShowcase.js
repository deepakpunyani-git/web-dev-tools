import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/ToolsShowcase.css';

const ToolsShowcase = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section className="tools-showcase">
      <div className="section-header">
        <h2>Explore Our Tools</h2>
      </div>
      <div className="tools-grid">
        <div className="tool-card">
          <h3>HTML Beautifier</h3>
          <p>Beautify your HTML code with just a click.</p>
          <Link onClick={handleScrollToTop} to="/html-beautifier" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>JS Beautifier</h3>
          <p>Format your JavaScript code to improve readability.</p>
          <Link onClick={handleScrollToTop} to="/js-beautifier" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>CSS Beautifier</h3>
          <p>Clean up and format your CSS stylesheets.</p>
          <Link onClick={handleScrollToTop} to="/css-beautifier" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>JS Minifier</h3>
          <p>Compress your JavaScript code to reduce file size.</p>
          <Link onClick={handleScrollToTop} to="/js-minifier" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>CSS Minifier</h3>
          <p>Minify CSS files to optimize your website's performance.</p>
          <Link onClick={handleScrollToTop} to="/css-minifier" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>JSON Formatter</h3>
          <p>Format and validate your JSON data.</p>
          <Link onClick={handleScrollToTop} to="/json-formatter" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>JSON to YAML</h3>
          <p>Convert JSON data into YAML format seamlessly.</p>
          <Link onClick={handleScrollToTop} to="/json-to-yaml" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>Text Case Converter</h3>
          <p>Convert text to different cases (upper, lower, title, etc.).</p>
          <Link to="/text-case-converter" >Try it now</Link>
        </div>
        <div className="tool-card">
          <h3>Password Strength Checker</h3>
          <p>Check the strength of your passwords to ensure security.</p>
          <Link to="/password-checker" >Try it now</Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsShowcase;
