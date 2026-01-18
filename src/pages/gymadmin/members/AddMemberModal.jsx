import React, { useState } from "react";
import styles from "./AddMemberModal.module.css";
import { X, Mail, User, Lock, Copy, Check, AlertCircle } from "lucide-react";
import { createMember } from "../../../services/gymAdminService";
import { useAuth } from "../../../context/AuthContext";

const AddMemberModal = ({ onClose, onCreated }) => {
  const { auth } = useAuth(); // Get current user auth info
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    plan: "monthly",
    start_date: new Date().toISOString().split('T')[0], // Today's date
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const update = (k, v) =>
    setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.email.trim()) {
      setError("Email required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Get gym_id from current user or localStorage
      const gymId = auth?.user?.gym_id || localStorage.getItem("gym_id");
      
      if (!gymId) {
        setError("Cannot determine gym. Please make sure you're logged in as a gym admin.");
        setLoading(false);
        return;
      }

      // Prepare payload according to backend schema
      const payload = {
        email: form.email.trim(),
        gym_id: parseInt(gymId, 10),
        plan: form.plan,
        status: form.status || "active",
        start_date: form.start_date
      };

      // Add full_name if provided
      if (form.full_name.trim()) {
        payload.full_name = form.full_name.trim();
      }

      console.log("Creating member with payload:", payload); // Debug log

      const result = await createMember(payload);
      console.log("Create member response:", result); // Debug log
      
      if (result.initial_password) {
        setSuccessData({
          email: result.member?.email || form.email,
          password: result.initial_password,
          memberId: result.member?.id,
          plan: result.member?.plan || form.plan
        });
      } else {
        alert("Member created successfully!");
        onCreated?.();
        onClose();
      }
    } catch (err) {
      console.error("Create member error:", err);
      
      // Show specific error message
      if (err.response?.data?.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = [];
        const errors = err.response.data.errors;
        
        if (errors.email) {
          errorMessages.push(`Email: ${errors.email[0]}`);
        }
        if (errors.gym_id) {
          errorMessages.push(`Gym ID: ${errors.gym_id[0]}`);
        }
        if (errors.plan) {
          errorMessages.push(`Plan: ${errors.plan[0]}`);
        }
        
        setError(errorMessages.join(", ") || "Validation error");
      } else if (err.response?.status === 409) {
        setError("Email already exists in the system");
      } else if (err.response?.status === 404) {
        setError("Gym not found. Please check your gym ID.");
      } else if (err.response?.status === 403) {
        setError("Permission denied. You cannot add members to this gym.");
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your connection.");
      } else {
        setError(`Failed to add member: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    onCreated?.();
    onClose();
  };

  if (successData) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2>✅ Member Created Successfully</h2>
            <button onClick={handleDone}><X size={18} /></button>
          </div>

          <div className={styles.successBody}>
            <div className={styles.successIcon}>👤</div>
            
            <div className={styles.credentialsBox}>
              <h3>Share these credentials with the client:</h3>
              
              <div className={styles.credentialItem}>
                <label>Email:</label>
                <div className={styles.credentialValue}>
                  {successData.email}
                  <button 
                    onClick={() => copyToClipboard(successData.email)}
                    className={styles.copyBtn}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className={styles.credentialItem}>
                <label>Temporary Password:</label>
                <div className={styles.credentialValue}>
                  <code className={styles.passwordDisplay}>
                    {successData.password}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(successData.password)}
                    className={styles.copyBtn}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className={styles.memberInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member ID:</span>
                  <span className={styles.infoValue}>#{successData.memberId}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Plan:</span>
                  <span className={styles.infoValue}>{successData.plan}</span>
                </div>
              </div>

              <div className={styles.warningBox}>
                <AlertCircle size={18} />
                <div>
                  <strong>Important:</strong>
                  <ul>
                    <li>Client should log in immediately and change their password</li>
                    <li>This password is only shown once</li>
                    <li>Send this information securely to the client</li>
                    <li>Login URL: {window.location.origin}/login</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                onClick={handleDone}
                className={styles.doneBtn}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Member</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Mail size={16} />
              Client Email *
            </label>
            <input
              type="email"
              className={styles.input}
              placeholder="client@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Membership Plan *
            </label>
            <select
              className={styles.select}
              value={form.plan}
              onChange={(e) => update("plan", e.target.value)}
            >
              <option value="daily">Daily Pass</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Start Date
            </label>
            <input
              type="date"
              className={styles.input}
              value={form.start_date}
              onChange={(e) => update("start_date", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Status
            </label>
            <select
              className={styles.select}
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className={styles.infoBox}>
            <p>
              <strong>Note:</strong> A random password will be generated 
              and shown after creation. The client can change it after first login.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button 
            onClick={save} 
            className={styles.saveBtn}
            disabled={loading || !form.email.trim()}
          >
            {loading ? (
              <>
                <div className={styles.spinnerSmall}></div>
                Creating...
              </>
            ) : (
              "Create Member"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;