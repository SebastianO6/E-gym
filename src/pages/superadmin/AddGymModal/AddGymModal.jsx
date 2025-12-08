// src/pages/superadmin/AddGymModal.jsx
import React, { useState } from "react";
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

  // Handle input changes
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Simple validation
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Gym name is required";
    if (!form.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!form.ownerEmail.includes("@"))
      newErrors.ownerEmail = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Phone number required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createGym = () => {
    if (!validate()) return;

    const payload = {
      name: form.name,
      owner: {
        name: form.ownerName,
        email: form.ownerEmail,
        phone: form.phone,
      },
      address: form.address,
    };

    // You can integrate with API later:
    // api.post("/admin/gyms", payload)

    if (onCreate) onCreate(payload);

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add New Gym</h2>

        <div className={styles.formGroup}>
          <label>Gym Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ex: Power Fitness Center"
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Owner Name</label>
          <input
            value={form.ownerName}
            onChange={(e) => updateField("ownerName", e.target.value)}
            placeholder="Ex: John Doe"
          />
          {errors.ownerName && (
            <p className={styles.error}>{errors.ownerName}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Owner Email</label>
          <input
            value={form.ownerEmail}
            onChange={(e) => updateField("ownerEmail", e.target.value)}
            placeholder="owner@example.com"
          />
          {errors.ownerEmail && (
            <p className={styles.error}>{errors.ownerEmail}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 555 444 3333"
          />
          {errors.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Gym Address</label>
          <textarea
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Street, City, Country"
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.save} onClick={createGym}>
            Save Gym
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGymModal;
