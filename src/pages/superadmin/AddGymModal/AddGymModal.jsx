import React, { useState } from "react";
import { X, Copy, Check, Key, Mail, AlertCircle, Loader2 } from "lucide-react";
import styles from "./AddGymModal.module.css";
import { createGym } from "../../../services/superadminService";

const AddGymModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    ownerEmail: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState(null);
  const [copied, setCopied] = useState({ email: false, password: false });
  const [apiError, setApiError] = useState("");

  const updateField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Gym name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (!form.ownerEmail.includes("@")) e.ownerEmail = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateGym = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await createGym({
        name: form.name,
        owner_name: form.ownerName,
        owner_email: form.ownerEmail,
        phone: form.phone,
        address: form.address,
      });

      setAdminCredentials(data.admin_credentials);
      onCreate(data.gym); // ✅ PASS RESULT ONLY
    } catch (e) {
      setApiError("Failed to create gym");
    } finally {
      setLoading(false);
    }
  };


  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [key]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [key]: false })), 1500);
  };

  const close = () => {
    setAdminCredentials(null);
    setApiError("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {!adminCredentials ? (
          <>
            <div className={styles.header}>
              <h2>Add New Gym</h2>
              <button onClick={close}><X size={18} /></button>
            </div>

            {apiError && (
              <div className={styles.apiError}>
                <AlertCircle size={16} /> {apiError}
              </div>
            )}

            {[
              ["Gym Name", "name"],
              ["Owner Name", "ownerName"],
              ["Owner Email", "ownerEmail"],
              ["Phone Number", "phone"],
            ].map(([label, key]) => (
              <div key={key} className={styles.formGroup}>
                <label>{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  disabled={loading}
                />
                {errors[key] && <p>{errors[key]}</p>}
              </div>
            ))}

            <div className={styles.formGroup}>
              <label>Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
              />
            </div>

            <div className={styles.footer}>
              <button onClick={close}>Cancel</button>
              <button onClick={handleCreateGym} disabled={loading}>
                {loading ? <Loader2 size={16} /> : "Create Gym"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Gym Admin Credentials</h3>

            <div>
              <Mail /> {adminCredentials.email}
              <button onClick={() => copy(adminCredentials.email, "email")}>
                {copied.email ? <Check /> : <Copy />}
              </button>
            </div>

            <div>
              <Key /> {adminCredentials.temporary_password}
              <button onClick={() => copy(adminCredentials.temporary_password, "password")}>
                {copied.password ? <Check /> : <Copy />}
              </button>
            </div>

            <button onClick={close}>Done</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddGymModal;
