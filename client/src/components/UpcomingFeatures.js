import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaPython, FaEnvelope, FaServer } from 'react-icons/fa';

const features = [
  {
    title: 'Mock APIs',
    icon: <FaServer size={50} color="#4CAF50" />,
    description: 'Quickly create and test APIs with ease.',
  },
  {
    title: 'Temp Mail',
    icon: <FaEnvelope size={50} color="#F44336" />,
    description: 'Free instant Email Generator address that self-destructed .',
  },
  {
    title: 'JS Code Tester',
    icon: <FaCode size={50} color="#2196F3" />,
    description: 'Test your JavaScript code online.',
  },
  {
    title: 'Python Beautifier',
    icon: <FaPython size={50} color="#FFD700" />,
    description: 'Format and beautify Python code instantly.',
  },
];

function UpcomingFeatures() {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Upcoming Features</h1>
      <div style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            style={styles.featureCard}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div style={styles.icon}>{feature.icon}</div>
            <h3 style={styles.title}>{feature.title}</h3>
            <p style={styles.description}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '45px',
    backgroundColor: '#2D2D2D',
    color: '#FFFFFF',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    color: '#E0E0E0',
  },
  featuresContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  featureCard: {
    background: '#3A3A3A',
    borderRadius: '10px',
    padding: '20px',
    width: '250px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
  },
  icon: {
    marginBottom: '15px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#FFFFFF',
  },
  description: {
    fontSize: '1rem',
    color: '#CCCCCC',
  },
};

export default UpcomingFeatures;
