import React from "react";
import styles from "./MemberRow.module.css";

const MemberRow = ({ member, onView, onMarkPaid }) => {
  const initials = member.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={styles.row}>
      <div className={styles.colName}>
        <div className={styles.avatar}>{initials}</div>

        <div>
          <div className={styles.name}>{member.name}</div>
          <div className={styles.meta}>{member.plan} Plan</div>
        </div>
      </div>

      <div className={styles.col}>{member.status}</div>
      <div className={styles.col}>{member.dueDate}</div>

      <div className={styles.actions}>
        <button className={styles.viewBtn} onClick={onView}>View</button>
        {member.status === "Payment Due" && (
          <button className={styles.payBtn} onClick={onMarkPaid}>Mark Paid</button>
        )}
      </div>
    </div>
  );
};

export default MemberRow;
