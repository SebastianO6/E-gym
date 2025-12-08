import React from 'react';
import styles from './StatsCard.module.css';

/**
 * StatsCard
 * Props:
 *  - title: string
 *  - value: string|number
 *  - subtitle: string (small)
 *  - colorClass: optional CSS class to show accent (string)
 */
const StatsCard = ({ title, value, subtitle, colorClass }) => {
  return (
    <div className={`${styles.card} ${colorClass ?? ''}`}>
      <div className={styles.meta}>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
};

export default StatsCard;
