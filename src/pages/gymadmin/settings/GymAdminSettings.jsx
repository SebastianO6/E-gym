// src/pages/gymadmin/settings/GymAdminSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Building, Lock, Shield } from "lucide-react";
import api from "../../../api/axios";
import styles from "./GymAdminSettings.module.css";

const GymAdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [gym, setGym] = useState(null);
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/gymadmin/profile");
      setProfile({
        name: response.data.user.name || "",
        email: response.data.user.email,
        phone: "" // Add phone to user model if needed
      });
      setGym(response.data.gym);
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
      await api.put("/gymadmin/profile", profile);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
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

    try {
      await api.put("/gymadmin/change-password", {
        current_password: password.current_password,
        new_password: password.new_password
      });

      setSuccess("Password changed successfully!");
      setPassword({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><User size={28} /> Account Settings</h1>
        <p>Manage your profile and security settings</p>
      </div>

      {success && <div className={styles.success}>{success}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18} /> Profile
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "password" ? styles.active : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={18} /> Password
        </button>
      </div>

      {activeTab === "profile" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h2><User size={20} /> Personal Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className={styles.formGroup}>
                <label><User size={16} /> Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.formGroup}>
                <label><Mail size={16} /> Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="Your email address"
                />
                <small>This will also update the gym owner email</small>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {gym && (
            <div className={styles.card}>
              <h2><Building size={20} /> Gym Information</h2>
              <div className={styles.gymInfo}>
                <p><strong>Gym Name:</strong> {gym.name}</p>
                <p><strong>Address:</strong> {gym.address}</p>
                <p><strong>Phone:</strong> {gym.phone}</p>
                <p><strong>Status:</strong> <span className={`${styles.status} ${gym.status === 'active' ? styles.active : styles.inactive}`}>
                  {gym.status}
                </span></p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "password" && (
        <div className={styles.tabContent}>
          <div className={styles.card}>
            <h2><Lock size={20} /> Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input
                  type="password"
                  value={password.current_password}
                  onChange={(e) => setPassword({...password, current_password: e.target.value})}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>New Password</label>
                <input
                  type="password"
                  value={password.new_password}
                  onChange={(e) => setPassword({...password, new_password: e.target.value})}
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={password.confirm_password}
                  onChange={(e) => setPassword({...password, confirm_password: e.target.value})}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !password.current_password || !password.new_password || !password.confirm_password}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymAdminSettings;