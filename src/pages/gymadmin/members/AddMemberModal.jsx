import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";
import { X } from "lucide-react";

const AddMemberModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    plan: "Monthly",
  });

  const update = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const save = () => {
    console.log("NEW MEMBER:", form);
    // TODO → api.post("/gymadmin/members", form)
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Member</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full Name"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+254..."
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subscription Plan</label>
            <select
              className={styles.select}
              value={form.plan}
              onChange={(e) => update("plan", e.target.value)}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;