import React from "react";
import styles from "./MemberRow.module.css";

const MemberRow = ({ member, onView, onSuspend }) => {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.row}>
      {/* Name Column */}
      <div className={styles.mainInfo}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.nameCol}>
          <h4>{member.name}</h4>
          <p className={styles.meta}>
            {member.plan} <span>•</span> {member.trainer || "No Trainer"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className={styles.details}>
        <div style={{ marginLeft: '16px' }}>
          <span className={`${styles.badge} ${member.status.toLowerCase() === 'active' ? styles.active : styles.inactive}`}>
            {member.status}
          </span>
        </div>

        <div className={styles.dueDate}>Due: {member.dueDate}</div>

        <div className={styles.actions}>
          <button className={styles.btnView} onClick={() => onView(member)}>View</button>
          <button className={styles.btnSuspend} onClick={() => onSuspend(member)}>Suspend</button>
        </div>
      </div>
    </div>
  );
};

export default MemberRow;