import React from "react";
import styles from "./MemberRow.module.css";

/**
 * MemberRow
 * Props:
 *  - member: { id, name, plan, status, dueDate, trainer }
 *  - onView(member)
 *  - onSuspend(member)
 */
const MemberRow = ({ member, onView, onSuspend }) => {
  return (
    <div className={styles.row}>
      <div className={styles.colName}>
        <div className={styles.avatar}>
          {member.name.split(" ").map(n => n[0]).join("").slice(0,2)}
        </div>
        <div>
          <div className={styles.name}>{member.name}</div>
          <div className={styles.meta}>{member.plan} · {member.trainer || "-"}</div>
        </div>
      </div>

      <div className={styles.col}>{member.status}</div>
      <div className={styles.col}>{member.dueDate}</div>

      <div className={styles.actions}>
        <button className={styles.viewBtn} onClick={() => onView(member)}>View</button>
        <button className={styles.suspendBtn} onClick={() => onSuspend(member)}>Suspend</button>
      </div>
    </div>
  );
};

export default MemberRow;
