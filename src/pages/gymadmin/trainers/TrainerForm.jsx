import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import styles from "./TrainerForm.module.css";

export default function TrainerForm({
  existingTrainer,
  onCreate,
  onUpdate,
  onCancel,
  onSuccess,
}) {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingTrainer) {
      setForm({
        email: existingTrainer.email || "",
        first_name: existingTrainer.first_name || "",
        last_name: existingTrainer.last_name || "",
        phone: existingTrainer.phone || "",
      });
    }
  }, [existingTrainer]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!existingTrainer && !form.email.trim()) {
      return setError("Email is required");
    }

    setLoading(true);
    try {
      if (existingTrainer) {
        await onUpdate(existingTrainer.id, form);
      } else {
        await onCreate(form);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header>
          <h2>{existingTrainer ? "Edit Trainer" : "Invite Trainer"}</h2>
          <button onClick={onCancel}><X /></button>
        </header>

        <form onSubmit={submit}>
          {!existingTrainer && (
            <>
              <label>Email *</label>
              <input name="email" value={form.email} onChange={change} />
            </>
          )}

          <label>First Name</label>
          <input name="first_name" value={form.first_name} onChange={change} />

          <label>Last Name</label>
          <input name="last_name" value={form.last_name} onChange={change} />

          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={change} />

          {error && <p className={styles.error}>{error}</p>}

          <button disabled={loading}>
            {loading ? "Please wait..." : existingTrainer ? "Save Changes" : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
}
