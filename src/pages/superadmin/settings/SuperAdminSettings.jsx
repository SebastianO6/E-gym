import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import api from "../../../api/axios";
import styles from "./SuperAdminSettings.module.css";

const SuperAdminSettings = () => {

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    email: "",
    name: ""
  });

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

      const res = await api.get("/auth/me");

      setProfile({
        email: res.data.email,
        name: `${res.data.first_name || ""} ${res.data.last_name || ""}`
      });

    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const handlePasswordChange = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (password.new_password !== password.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {

      await api.put("/auth/change-password", {
        current_password: password.current_password,
        new_password: password.new_password
      });

      setSuccess("Password changed successfully");

      setPassword({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

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
        <h1><Shield size={28}/> Super Admin Settings</h1>
        <p>Manage your platform account</p>
      </div>

      {success && <div className={styles.success}>{success}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tabs}>

        <button
          className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18}/> Profile
        </button>

        <button
          className={`${styles.tab} ${activeTab === "password" ? styles.active : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <Lock size={18}/> Password
        </button>

      </div>


      {/* PROFILE TAB */}

      {activeTab === "profile" && (

        <div className={styles.card}>

          <h2><User size={20}/> Account Information</h2>

          <div className={styles.infoRow}>
            <label>Email</label>

            <div className={styles.value}>
              <Mail size={16}/> {profile.email}
            </div>
          </div>

          <div className={styles.infoRow}>
            <label>Name</label>

            <div className={styles.value}>
              <User size={16}/> {profile.name || "Super Admin"}
            </div>
          </div>

        </div>

      )}


      {/* PASSWORD TAB */}

      {activeTab === "password" && (

        <div className={styles.card}>

          <h2><Lock size={20}/> Change Password</h2>

          <form onSubmit={handlePasswordChange}>

            {/* CURRENT PASSWORD */}

            <div className={styles.formGroup}>
              <label>Current Password</label>

              <div className={styles.passwordField}>

                <input
                  type={showCurrent ? "text" : "password"}
                  value={password.current_password}
                  onChange={(e) =>
                    setPassword({ ...password, current_password: e.target.value })
                  }
                  required
                />

                <span onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>

              </div>
            </div>


            {/* NEW PASSWORD */}

            <div className={styles.formGroup}>
              <label>New Password</label>

              <div className={styles.passwordField}>

                <input
                  type={showNew ? "text" : "password"}
                  value={password.new_password}
                  onChange={(e) =>
                    setPassword({ ...password, new_password: e.target.value })
                  }
                  required
                />

                <span onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>

              </div>
            </div>


            {/* CONFIRM PASSWORD */}

            <div className={styles.formGroup}>
              <label>Confirm New Password</label>

              <div className={styles.passwordField}>

                <input
                  type={showConfirm ? "text" : "password"}
                  value={password.confirm_password}
                  onChange={(e) =>
                    setPassword({ ...password, confirm_password: e.target.value })
                  }
                  required
                />

                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </span>

              </div>
            </div>


            <button
              type="submit"
              disabled={
                loading ||
                !password.current_password ||
                !password.new_password ||
                !password.confirm_password
              }
            >
              {loading ? "Changing..." : "Change Password"}
            </button>

          </form>

        </div>

      )}

    </div>

  );
};

export default SuperAdminSettings;