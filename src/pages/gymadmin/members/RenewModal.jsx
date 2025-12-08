import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";

const RenewModal = ({ onClose }) => {
  const [plan, setPlan] = useState("Monthly");

  const renew = () => {
    console.log("RENEW PLAN:", plan);
    // TODO → api.post("/gymadmin/members/renew", { plan })
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Renew Subscription</h2>

        <label>Select Plan</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>3 Months</option>
          <option>6 Months</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
          <button className={styles.save} onClick={renew}>Renew</button>
        </div>
      </div>
    </div>
  );
};

export default RenewModal;
