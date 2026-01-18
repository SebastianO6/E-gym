import React, { useState } from "react";
import { X, Copy, Check, Key, Mail, AlertCircle, Loader2 } from "lucide-react";
import styles from "./AddGymModal.module.css";
import api from "../../../api/axios";

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
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Gym name required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name required";
    if (!form.ownerEmail.includes("@")) e.ownerEmail = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const createGym = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      const response = await api.post('/superadmin/gyms', {
        name: form.name,
        address: form.address,
        owner_name: form.ownerName,
        owner_email: form.ownerEmail,
        phone: form.phone,
      });

      const data = response.data;
      
      if (response.status === 201) {
        setAdminCredentials(data.admin_credentials);
        if (onCreate) onCreate(data.gym);
      } else {
        setApiError(data.error || `Failed to create gym: ${response.status}`);
      }
    } catch (error) {
      console.error("Create gym error:", error);
      
      if (error.response) {
        // Server responded with error
        const errorMsg = error.response.data?.error || 
                        error.response.data?.message || 
                        `Server error: ${error.response.status}`;
        setApiError(errorMsg);
        
        // If 401 Unauthorized, token might be invalid
        if (error.response.status === 401) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else if (error.request) {
        // Request made but no response
        setApiError("No response from server. Check if backend is running on port 5000.");
      } else {
        // Something else happened
        setApiError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminCredentials(null);
    setApiError("");
    onClose();
  };

  const handleCopyCredentials = () => {
    if (adminCredentials) {
      const text = `Gym Admin Credentials:\nEmail: ${adminCredentials.email}\nTemporary Password: ${adminCredentials.temporary_password}\n\n${adminCredentials.note}`;
      navigator.clipboard.writeText(text);
      alert("All credentials copied to clipboard!");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {!adminCredentials ? (
          <>
            {/* CREATE GYM FORM */}
            <div className={styles.header}>
              <h2>Add New Gym</h2>
              <button onClick={handleClose} className={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.body}>
              {apiError && (
                <div className={styles.apiError}>
                  <AlertCircle size={16} />
                  <span>{apiError}</span>
                  <button 
                    onClick={() => setApiError("")}
                    className={styles.dismissError}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Gym Name *</label>
                <input
                  placeholder="Enter gym name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={errors.name ? styles.errorInput : ""}
                  disabled={loading}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Owner Name *</label>
                <input
                  placeholder="Enter owner's full name"
                  value={form.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                  className={errors.ownerName ? styles.errorInput : ""}
                  disabled={loading}
                />
                {errors.ownerName && <p className={styles.errorText}>{errors.ownerName}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Owner Email *</label>
                <input
                  type="email"
                  placeholder="owner@example.com"
                  value={form.ownerEmail}
                  onChange={(e) => updateField("ownerEmail", e.target.value)}
                  className={errors.ownerEmail ? styles.errorInput : ""}
                  disabled={loading}
                />
                {errors.ownerEmail && <p className={styles.errorText}>{errors.ownerEmail}</p>}
                <small className={styles.hint}>
                  This will be the gym admin login email
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={errors.phone ? styles.errorInput : ""}
                  disabled={loading}
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <textarea
                  placeholder="Full gym address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button 
                onClick={handleClose} 
                className={styles.cancelBtn}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={createGym} 
                className={styles.saveBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className={styles.spinner} size={16} />
                    Creating...
                  </>
                ) : "Create Gym & Admin"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* CREDENTIALS DISPLAY */}
            <div className={styles.header}>
              <h2>✅ Gym Created Successfully!</h2>
              <button onClick={handleClose} className={styles.closeBtn}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.credentialsBody}>
              <div className={styles.successMessage}>
                <p>Gym has been created and a gym admin account has been set up.</p>
                <p className={styles.warning}>
                  <strong>Important:</strong> Share these credentials with the gym owner. 
                  They must change their password on first login.
                </p>
              </div>

              <div className={styles.credentialsCard}>
                <div className={styles.credentialsHeader}>
                  <h3>Gym Admin Credentials</h3>
                  <button 
                    onClick={handleCopyCredentials}
                    className={styles.copyAllBtn}
                  >
                    <Copy size={14} />
                    Copy All
                  </button>
                </div>
                
                <div className={styles.credentialItem}>
                  <div className={styles.credentialHeader}>
                    <Mail size={16} />
                    <span>Email Address</span>
                  </div>
                  <div className={styles.credentialValue}>
                    <code>{adminCredentials.email}</code>
                    <button 
                      onClick={() => copyToClipboard(adminCredentials.email, 'email')}
                      className={styles.copyBtn}
                      title="Copy email"
                    >
                      {copied.email ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className={styles.credentialItem}>
                  <div className={styles.credentialHeader}>
                    <Key size={16} />
                    <span>Temporary Password</span>
                  </div>
                  <div className={styles.credentialValue}>
                    <code className={styles.password}>{adminCredentials.temporary_password}</code>
                    <button 
                      onClick={() => copyToClipboard(adminCredentials.temporary_password, 'password')}
                      className={styles.copyBtn}
                      title="Copy password"
                    >
                      {copied.password ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <small className={styles.passwordHint}>
                    This password is only shown once. Make sure to save it.
                  </small>
                </div>

                <div className={styles.loginInstructions}>
                  <h4>Login Instructions:</h4>
                  <ol>
                    <li>Go to the login page</li>
                    <li>Use the email and temporary password above</li>
                    <li>You will be prompted to set a new password immediately</li>
                    <li>After setting a new password, you'll have full access</li>
                  </ol>
                </div>
              </div>

              <div className={styles.notes}>
                <p><strong>Security Notes:</strong></p>
                <ul>
                  <li>Never share these credentials via email or insecure channels</li>
                  <li>The gym admin should change their password immediately</li>
                  <li>You can reset the password later from the superadmin panel if needed</li>
                  <li>Consider using a secure messaging app or in-person delivery</li>
                </ul>
              </div>
            </div>

            <div className={styles.footer}>
              <button onClick={handleClose} className={styles.doneBtn}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddGymModal;