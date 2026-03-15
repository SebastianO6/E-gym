import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";
import { X, Mail, User, Phone, AlertCircle } from "lucide-react";
import { inviteMember } from "../../../services/gymAdminService";
import { useAuth } from "../../../context/AuthContext";

const AddMemberModal = ({ onClose, onCreated }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    plan: "monthly",
    start_date: new Date().toISOString().split("T")[0],
    status: "active"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    const gymId = auth?.user?.gym_id || localStorage.getItem("gym_id");

    if (!gymId) {
      setError("Gym not detected. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // split full name
      const nameParts = form.full_name.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ");

      const payload = {
        email: form.email.trim(),
        first_name,
        last_name,
        phone: form.phone.trim(),
        gym_id: Number(gymId),
        plan: form.plan,
        start_date: form.start_date,
        status: form.status
      };

      await inviteMember(payload);

      onCreated?.();
      onClose();

    } catch (err) {
      const res = err.response;

      if (res?.data?.error) setError(res.data.error);
      else if (res?.status === 409) setError("Member already exists");
      else setError("Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add Member</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <label>
            <Mail size={16}/> Email *
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </label>

          <label>
            <User size={16}/> Full Name *
            <input
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder="John Doe"
            />
          </label>

          <label>
            <Phone size={16}/> Phone *
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="0712345678"
            />
          </label>

          <label>
            Plan
            <select
              value={form.plan}
              onChange={(e) => update("plan", e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => update("start_date", e.target.value)}
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose}>Cancel</button>

          <button onClick={save} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;