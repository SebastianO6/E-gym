import React from "react";
import styles from "./ClientCard.module.css";

const ClientCard = ({ client }) => {
  const initials = client.name.split(" ").map(n => n[0]).join("");

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>{initials}</div>

      <div className={styles.info}>
        <div className={styles.name}>{client.name}</div>
        <div className={styles.meta}>{client.level} • {client.goal}</div>
      </div>
    </div>
  );
};

export default ClientCard;
