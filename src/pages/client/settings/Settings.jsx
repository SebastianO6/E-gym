import React, { useState } from "react";
import { Lock, User, Mail, Shield, Key, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import styles from "./Settings.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
  });

  // Password form
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get user info on load
  React.useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data;
      
      // Try to get additional info if available
      const memberResponse = await api.get("/client/me");
      const member = memberResponse.data;
      
      setProfile({
        full_name: member.full_name || user.name || "",
        phone: member.phone || "",
        email: user.email
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/client/profile", profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (password.new_password !== password.confirm_password) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (password.new_password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      await api.put("/auth/change-password", {
        current_password: password.current_password,
        new_password: password.new_password
      });

      setSuccess("Password changed successfully!");
      setPassword({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Password change error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "#e5e7eb" };
    
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;

    let label = "", color = "";
    if (strength <= 25) {
      label = "Weak";
      color = "#ef4444";
    } else if (strength <= 50) {
      label = "Fair";
      color = "#f59e0b";
    } else if (strength <= 75) {
      label = "Good";
      color = "#10b981";
    } else {
      label = "Strong";
      color = "#059669";
    }

    return { strength, label, color };
  };

  const passwordStrength = checkPasswordStrength(password.new_password);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <User size={28} />
          Account Settings
        </h1>
        <p className={styles.subtitle}>
          Manage your profile and security settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={styles.successAlert}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button 
            className={styles.dismissError}
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18} />
          Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === "password" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={18} />
          Password & Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <User size={20} />
              Personal Information
            </h2>

            <form onSubmit={handleProfileUpdate} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  className={styles.input}
                  value={profile.email || ""}
                  disabled
                  readOnly
                />
                <div className={styles.hint}>
                  Email cannot be changed. Contact support if needed.
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelIcon}>📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={styles.input}
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Lock size={20} />
              Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Key size={16} />
                  Current Password
                </label>
                <div className={styles.passwordInput}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    className={styles.input}
                    value={password.current_password}
                    onChange={(e) => setPassword({...password, current_password: e.target.value})}
                    placeholder="Enter your current password"
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
                  <Shield size={16} />
                  New Password
                </label>
                <div className={styles.passwordInput}>
                  <input
                    type={showNew ? "text" : "password"}
                    className={styles.input}
                    value={password.new_password}
                    onChange={(e) => setPassword({...password, new_password: e.target.value})}
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

                {/* Password Strength Indicator */}
                {password.new_password && (
                  <div className={styles.passwordStrength}>
                    <div className={styles.strengthBar}>
                      <div 
                        className={styles.strengthFill}
                        style={{
                          width: `${passwordStrength.strength}%`,
                          background: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <div className={styles.strengthLabel}>
                      Strength: <span style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.passwordRules}>
                  <p className={styles.rulesTitle}>Password must contain:</p>
                  <ul className={styles.rulesList}>
                    <li className={password.new_password.length >= 8 ? styles.ruleMet : styles.ruleUnmet}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password.new_password) ? styles.ruleMet : styles.ruleUnmet}>
                      One uppercase letter
                    </li>
                    <li className={/\d/.test(password.new_password) ? styles.ruleMet : styles.ruleUnmet}>
                      One number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password.new_password) ? styles.ruleMet : styles.ruleUnmet}>
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Shield size={16} />
                  Confirm New Password
                </label>
                <div className={styles.passwordInput}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    className={styles.input}
                    value={password.confirm_password}
                    onChange={(e) => setPassword({...password, confirm_password: e.target.value})}
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
                  password.new_password && password.confirm_password && password.new_password === password.confirm_password 
                    ? styles.matched 
                    : styles.notMatched
                }`}>
                  {password.new_password && password.confirm_password ? (
                    password.new_password === password.confirm_password ? 
                      "✓ Passwords match" : 
                      "✗ Passwords do not match"
                  ) : null}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={loading || !password.current_password || !password.new_password || !password.confirm_password}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinnerSmall}></div>
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <div className={styles.securityCard}>
            <h3 className={styles.securityTitle}>
              <Shield size={20} />
              Security Tips
            </h3>
            <ul className={styles.securityTips}>
              <li>Use a unique password not used elsewhere</li>
              <li>Include a mix of letters, numbers, and symbols</li>
              <li>Avoid common words or personal information</li>
              <li>Consider using a password manager</li>
              <li>Change your password every 3-6 months</li>
              <li>Never share your password with anyone</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
