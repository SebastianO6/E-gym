import { useState, useEffect } from "react";
import api from "../../api/axios";
import styles from "./EditGymModal.module.css";

const EditGymModal = ({ gym, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    status: "active",
  });

  useEffect(() => {
    if (gym) {
      setForm({
        name: gym.name || "",
        phone: gym.phone || "",
        address: gym.address || "",
        status: gym.status || "active"
      });
    }
  }, [gym]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // check if anything changed
    const hasChanges = Object.keys(form).some((key) => form[key] !== gym[key]);
    if (!hasChanges) {
      onClose();
      return;
    }

    await api.put(`/superadmin/gyms/${gym.id}`, form);
    onSave({ ...gym, ...form });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Edit Gym</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>Address</label>
        <input name="address" value={form.address} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditGymModal;  