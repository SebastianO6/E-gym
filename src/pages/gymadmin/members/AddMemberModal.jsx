import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";

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
        <h2>Add New Member</h2>

        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <label>Phone</label>
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />

        <label>Subscription Plan</label>
        <select
          value={form.plan}
          onChange={(e) => update("plan", e.target.value)}
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.save} onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
