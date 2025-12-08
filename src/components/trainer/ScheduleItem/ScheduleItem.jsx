import React from "react";
import styles from "./ScheduleItem.module.css";

const ScheduleItem = ({ schedule }) => {
  return (
    <div className={styles.row}>
      <div>{schedule.time}</div>
      <div className={styles.client}>{schedule.client}</div>
      <div className={styles.type}>{schedule.type}</div>
    </div>
  );
};

export default ScheduleItem;
