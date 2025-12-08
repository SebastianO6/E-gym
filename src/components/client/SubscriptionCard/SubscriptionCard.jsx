import React from "react";
import styles from "./SubscriptionCard.module.css";

const SubscriptionCard = ({ user }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.plan}>{user.plan}</h3>
      <p className={styles.info}>Next Payment: {user.nextPayment}</p>
      <p className={styles.info}>Days Remaining: {user.remainingDays}</p>
    </div>
  );
};

export default SubscriptionCard;
