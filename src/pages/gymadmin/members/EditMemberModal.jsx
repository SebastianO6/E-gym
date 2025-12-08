import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";

const EditMemberModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "Samuel Karanja",
    phone: "0712 345 678",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    console.log("UPDATED MEMBER:", form);
    // TODO → api.put(`/members/${id}`, form)
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Member</h2>

        <label>Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} />

        <label>Phone</label>
        <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
          <button onClick={save} className={styles.save}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;
