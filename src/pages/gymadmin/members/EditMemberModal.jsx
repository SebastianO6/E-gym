import React, { useState, useEffect } from "react";
import styles from "./EditMemberModal.module.css";
import { X } from "lucide-react";

const EditMemberModal = ({ member, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        phone: member.phone || "",
      });
    }
  }, [member]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    console.log("UPDATED MEMBER:", member.id, form);
    // TODO → api.put(`/members/${member.id}`, form)
    onClose();
  };

  if (!member) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Member</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={save} className={styles.saveBtn}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;