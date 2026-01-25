import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./EditGymModal.module.css";

const EditGymModal = ({ onClose, gym, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    if (gym) {
      setForm({
        name: gym.name || "",
        ownerName: "",
        ownerEmail: gym.owner_email || "",
        phone: gym.phone || "",
        address: gym.address || "",
        status: "active",
      });
    }
  }, [gym]);


  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const saveChanges = () => {
    if (!form.name.trim()) return alert("Gym name required");
    if (!form.ownerName.trim()) return alert("Owner name required");
    if (!form.ownerEmail.includes("@")) return alert("Valid owner email required");

    const updated = {
      ...gym,
      name: form.name,
      owner: { ...gym.owner, name: form.ownerName, email: form.ownerEmail, phone: form.phone },
      address: form.address,
      status: form.status,
    };

    onSave(updated);
    onClose();
  };

  if (!gym) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Gym</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gym Name</label>
            <input 
              value={form.name} 
              onChange={(e) => update("name", e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select 
              value={form.status} 
              onChange={(e) => update("status", e.target.value)}
              className={styles.select}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
                <label className={styles.label}>Owner Name</label>
                <input 
                  value={form.ownerName} 
                  onChange={(e) => update("ownerName", e.target.value)} 
                  className={styles.input}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input 
                  value={form.phone} 
                  onChange={(e) => update("phone", e.target.value)} 
                  className={styles.input}
                />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Owner Email</label>
            <input 
              value={form.ownerEmail} 
              onChange={(e) => update("ownerEmail", e.target.value)} 
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Address</label>
            <textarea 
              value={form.address} 
              onChange={(e) => update("address", e.target.value)} 
              className={styles.textarea}
              rows="3"
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={saveChanges}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGymModal;