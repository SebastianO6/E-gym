import React, { useState } from "react";
import styles from "./RenewModal.module.css";
import { X } from "lucide-react";

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
        <div className={styles.header}>
          <h2 className={styles.title}>Renew Subscription</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Plan</label>
            <select className={styles.select} value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>3 Months</option>
              <option>6 Months</option>
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={renew}>Renew</button>
        </div>
      </div>
    </div>
  );
};

export default RenewModal;