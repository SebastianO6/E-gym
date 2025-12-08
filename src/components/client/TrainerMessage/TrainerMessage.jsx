import React from "react";
import styles from "./TrainerMessage.module.css";

const TrainerMessage = ({ message }) => {
  const initials = message.from.split(" ").map(n => n[0]).join("");

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>{initials}</div>

      <div className={styles.info}>
        <div className={styles.row}>
          <h4 className={styles.name}>{message.from}</h4>
          <span className={styles.time}>{message.time}</span>
        </div>

        <p className={styles.text}>{message.message}</p>

        <button className={styles.replyBtn}>Reply</button>
      </div>
    </div>
  );
};

export default TrainerMessage;
