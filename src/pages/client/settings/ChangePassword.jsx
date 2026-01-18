import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import api from "../../../api/axios";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (form.new_password !== form.confirm_password) {
      setError("New passwords do not match");
      return;
    }

    if (form.new_password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await api.put("/auth/change-password", {
        current_password: form.current_password,
        new_password: form.new_password
      });

      setSuccess(true);
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Change password error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Lock size={24} />
          Change Password
        </h2>
        <p className={styles.subtitle}>
          Update your account password for better security
        </p>
      </div>

      {success && (
        <div className={styles.successAlert}>
          <CheckCircle size={20} />
          <span>Password changed successfully!</span>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Current Password
          </label>
          <div className={styles.passwordInput}>
            <input
              type={showCurrent ? "text" : "password"}
              className={styles.input}
              value={form.current_password}
              onChange={(e) => setForm({...form, current_password: e.target.value})}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className={styles.toggleVisibility}
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            New Password
          </label>
          <div className={styles.passwordInput}>
            <input
              type={showNew ? "text" : "password"}
              className={styles.input}
              value={form.new_password}
              onChange={(e) => setForm({...form, new_password: e.target.value})}
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              className={styles.toggleVisibility}
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className={styles.passwordRules}>
            <span>Password must contain:</span>
            <ul>
              <li className={form.new_password.length >= 8 ? styles.valid : styles.invalid}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(form.new_password) ? styles.valid : styles.invalid}>
                One uppercase letter
              </li>
              <li className={/\d/.test(form.new_password) ? styles.valid : styles.invalid}>
                One number
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Confirm New Password
          </label>
          <div className={styles.passwordInput}>
            <input
              type={showConfirm ? "text" : "password"}
              className={styles.input}
              value={form.confirm_password}
              onChange={(e) => setForm({...form, confirm_password: e.target.value})}
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              className={styles.toggleVisibility}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className={`${styles.matchIndicator} ${
            form.new_password && form.confirm_password && form.new_password === form.confirm_password 
              ? styles.matched 
              : styles.notMatched
          }`}>
            {form.new_password && form.confirm_password ? (
              form.new_password === form.confirm_password ? 
                "✓ Passwords match" : 
                "✗ Passwords do not match"
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </div>
      </form>

      <div className={styles.securityTips}>
        <h4>🔒 Security Tips:</h4>
        <ul>
          <li>Use a unique password not used elsewhere</li>
          <li>Include a mix of letters, numbers, and symbols</li>
          <li>Avoid common words or personal information</li>
          <li>Consider using a password manager</li>
        </ul>
      </div>
    </div>
  );
};

export default ChangePassword;