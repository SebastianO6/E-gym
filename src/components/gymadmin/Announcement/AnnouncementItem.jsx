import React from "react";
import styles from "./AnnouncementItem.module.css";

const AnnouncementItem = ({ announcement }) => {
  return (
    <div className={styles.item}>
      <h4 className={styles.title}>{announcement.title}</h4>
      <p className={styles.message}>{announcement.message}</p>
    </div>
  );
};

export default AnnouncementItem;
