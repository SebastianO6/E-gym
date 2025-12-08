import React from "react";
import styles from "./WorkoutItem.module.css";

const WorkoutItem = ({ workout }) => {
  return (
    <div className={styles.item}>
      <div className={styles.name}>{workout.name}</div>
      <div className={styles.meta}>{workout.clients} clients using this plan</div>
    </div>
  );
};

export default WorkoutItem;
