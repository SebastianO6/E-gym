// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ShieldAlert size={64} className={styles.icon} />
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You don't have permission to access this page.
        </p>
        <button 
          onClick={() => navigate('/')}
          className={styles.homeButton}
        >
          <Home size={18} />
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;