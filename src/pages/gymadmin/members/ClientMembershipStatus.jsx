import React, { useEffect, useState } from "react";
import styles from "./ClientMembershipStatus.module.css";
import { getMyMembershipStatus } from "../../../services/memberService";

export default function ClientMembershipStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    getMyMembershipStatus().then(setStatus);
  }, []);

  if (!status) return null;

  return (
    <div
      className={`${styles.card} ${
        status.expired ? styles.expired : styles.active
      }`}
    >
      <h3>My Membership</h3>
      <p>Due Date: <strong>{status.due_date}</strong></p>

      {status.expired ? (
        <p className={styles.warning}>⚠️ Membership Expired</p>
      ) : (
        <p className={styles.ok}>✅ Active</p>
      )}
    </div>
  );
}
