import React from "react";
import styles from "./ClientProgress.module.css";
import { BarChart2 } from "lucide-react";

const ClientProgress = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Progress Tracking</h2>
        <p>Track your weight, sets, and reps over time.</p>
      </div>

      <div className={styles.placeholder}>
        <BarChart2 size={48} className={styles.icon} />
        <p>📊 Analytics and progress charts are coming soon!</p>
        <small>Your trainer is setting up your tracking metrics.</small>
      </div>
    </div>
  );
};

export default ClientProgress;