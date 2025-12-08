import React from "react";
import styles from "./ClientProgress.module.css";

const ClientProgress = () => {
  return (
    <div className={styles.container}>
      <h2>Progress Tracking</h2>
      <p>This feature will display charts & analytics from the backend soon.</p>

      <div className={styles.placeholder}>
        📊 Progress charts coming soon…
      </div>
    </div>
  );
};

export default ClientProgress;
