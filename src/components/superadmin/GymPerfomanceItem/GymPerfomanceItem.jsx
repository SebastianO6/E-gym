import React from 'react';
import styles from './GymPerfomanceItem.module.css';

/**
 * GymPerformanceItem
 * Lightweight component for listing a gym's summary
 * props:
 *   - gym: { id, name, members, revenue, growth, status }
 *   - onViewDetails(gym)
 */
const GymPerformanceItem = ({ gym, onViewDetails }) => {
  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <div className={styles.badge}>
          {gym.name.slice(0,2).toUpperCase()}
        </div>
        <div>
          <div className={styles.name}>{gym.name}</div>
          <div className={styles.sub}>{gym.members} Active Members</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.stat}>
          <div className={styles.label}>Revenue</div>
          <div className={styles.value}>${Number(gym.revenue).toLocaleString()}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Growth</div>
          <div className={styles.valueGreen}>{gym.growth}</div>
        </div>

        <button className={styles.viewBtn} onClick={() => onViewDetails(gym)}>View Details</button>
      </div>
    </div>
  );
};

export default GymPerformanceItem;
