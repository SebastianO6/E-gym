import React, { useState, useCallback } from "react";
import styles from "./AddMemberModal.module.css";
import { X, Mail, User, Copy, Check, AlertCircle } from "lucide-react";
import { inviteMember } from "../../../services/gymAdminService";
import { useAuth } from "../../../context/AuthContext";

const AddMemberModal = ({ onClose, onCreated }) => {
  const { auth } = useAuth();

  const [form, setForm] = useState({
    email: "",
    plan: "monthly",
    start_date: new Date().toISOString().split("T")[0],
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy");
    }
  };

  const save = async () => {
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    const gymId = auth?.user?.gym_id || localStorage.getItem("gym_id");
    if (!gymId) {
      setError("Unable to determine gym. Please re-login.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        email: form.email.trim(),
        gym_id: Number(gymId),
        plan: form.plan,
        status: form.status,
        start_date: form.start_date
      };

      const result = await inviteMember(payload.email);


      if (result?.initial_password) {
        setSuccessData({
          email: result.member?.email ?? payload.email,
          password: result.initial_password,
          memberId: result.member?.id,
          plan: result.member?.plan ?? payload.plan,
        });
      } else {
        onCreated?.();
        onClose();
      }
    } catch (err) {
      const res = err.response;
      if (res?.data?.error) setError(res.data.error);
      else if (res?.status === 409) setError("Email already exists");
      else if (res?.status === 403) setError("Permission denied");
      else if (err.message === "Network Error") setError("Network error");
      else setError("Failed to create member");
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>✅ Member Created</h2>
            <button onClick={onClose}><X size={18} /></button>
          </div>

          <div className={styles.successBody}>
            <div className={styles.credentialsBox}>
              <div className={styles.credentialItem}>
                <label>Email</label>
                <div>
                  {successData.email}
                  <button onClick={() => copyToClipboard(successData.email)}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className={styles.credentialItem}>
                <label>Temporary Password</label>
                <div>
                  <code>{successData.password}</code>
                  <button onClick={() => copyToClipboard(successData.password)}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className={styles.warningBox}>
                <AlertCircle size={18} />
                <p>
                  Client must change password on first login.<br />
                  Login URL: {window.location.origin}/login
                </p>
              </div>
            </div>

            <button className={styles.doneBtn} onClick={() => {
              onCreated?.();
              onClose();
            }}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add Member</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <label>
            <Mail size={16} /> Email *
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </label>

          <label>
            <User size={16} /> Full Name
            <input
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </label>

          <label>
            Plan
            <select value={form.plan} onChange={(e) => update("plan", e.target.value)}>
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
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
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
