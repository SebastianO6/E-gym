import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./AddGymModal.module.css";

const AddGymModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[field];
            return newErrors;
        });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Gym name is required";
    if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!form.ownerEmail.includes("@")) newErrors.ownerEmail = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Phone number required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createGym = () => {
    if (!validate()) return;
    const payload = {
      name: form.name,
      owner: { name: form.ownerName, email: form.ownerEmail, phone: form.phone },
      address: form.address,
    };
    if (onCreate) onCreate(payload);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Gym</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Gym Name</label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ex: Power Fitness Center"
              className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Owner Name</label>
            <input
              value={form.ownerName}
              onChange={(e) => updateField("ownerName", e.target.value)}
              placeholder="Ex: John Doe"
              className={`${styles.input} ${errors.ownerName ? styles.errorInput : ''}`}
            />
            {errors.ownerName && <p className={styles.errorText}>{errors.ownerName}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Owner Email</label>
            <input
              value={form.ownerEmail}
              onChange={(e) => updateField("ownerEmail", e.target.value)}
              placeholder="owner@example.com"
              className={`${styles.input} ${errors.ownerEmail ? styles.errorInput : ''}`}
            />
            {errors.ownerEmail && <p className={styles.errorText}>{errors.ownerEmail}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 555 444 3333"
              className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
            />
            {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Gym Address</label>
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Street, City, Country"
              rows="3"
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={createGym}>Save Gym</button>
        </div>
      </div>
    </div>
  );
};

export default AddGymModal;