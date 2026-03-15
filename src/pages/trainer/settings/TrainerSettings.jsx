import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import styles from "./TrainerSettings.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function TrainerSettings() {

  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: ""
  });

  const [message, setMessage] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Load trainer profile
  useEffect(() => {
    api.get("/trainer/profile")
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, []);

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put("/trainer/profile", profile);
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await api.put("/trainer/change-password", passwords);

      setMessage("Password changed successfully");

      setPasswords({
        current_password: "",
        new_password: ""
      });

    } catch {
      setMessage("Password change failed");
    }
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Trainer Settings</h2>

      {message && <p className={styles.message}>{message}</p>}

      {/* Tabs */}
      <div className={styles.tabs}>

        <div
          className={`${styles.tab} ${tab === "profile" ? styles.activeTab : ""}`}
          onClick={() => setTab("profile")}
        >
          Profile
        </div>

        <div
          className={`${styles.tab} ${tab === "password" ? styles.activeTab : ""}`}
          onClick={() => setTab("password")}
        >
          Security
        </div>

      </div>


      {/* Profile Panel */}
      <div className={`${styles.panel} ${tab === "profile" ? styles.activePanel : ""}`}>

        <form className={styles.card} onSubmit={handleProfileUpdate}>

          <h3>Profile</h3>

          <label>Name</label>
          <input
            type="text"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />

          <label>Phone</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />

          <button type="submit">Update Profile</button>

        </form>

      </div>


      {/* Password Panel */}
      <div className={`${styles.panel} ${tab === "password" ? styles.activePanel : ""}`}>

        <form className={styles.card} onSubmit={handlePasswordChange}>

          <h3>Change Password</h3>

          <label>Current Password</label>

          <div className={styles.passwordField}>
            <input
              type={showCurrent ? "text" : "password"}
              value={passwords.current_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  current_password: e.target.value
                })
              }
            />

            <span onClick={() => setShowCurrent(!showCurrent)}>
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>


          <label>New Password</label>

          <div className={styles.passwordField}>
            <input
              type={showNew ? "text" : "password"}
              value={passwords.new_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  new_password: e.target.value
                })
              }
            />

            <span onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit">Change Password</button>

        </form>

      </div>

    </div>
  );
}