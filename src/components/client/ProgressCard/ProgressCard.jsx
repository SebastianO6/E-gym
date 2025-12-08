import React from "react";
import styles from "./ProgressCard.module.css";

const ProgressCard = ({ label, value, color }) => {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </div>
  );
};

export default ProgressCard;
