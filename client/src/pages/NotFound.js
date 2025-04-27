// src/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>Oops! The page you are looking for does not exist.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  heading: {
    fontSize: '48px',
    color: '#333',
  },
  text: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#666',
  },
  link: {
    fontSize: '18px',
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default NotFound;
