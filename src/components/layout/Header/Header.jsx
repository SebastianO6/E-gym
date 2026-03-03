import React from "react";
import styles from "./Header.module.css";
import { getCurrentUser } from "../../../utils/authLocal";
import {  Menu } from "lucide-react"

export default function Header ({ activeTab, toggleSidebar }) {
  const user = getCurrentUser();

  const gymName =
    user?.gym?.name ||
    user?.gym_name ||
    localStorage.getItem("gym_name") ||
    "Your Gym";

  return (
    <header className={styles.header}>
      <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
        <Menu size={22} />
      </button>
      <div className={styles.left}>
        <h2>{activeTab ? activeTab.toUpperCase() : "DASHBOARD"}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.greeting}>
          <div className={styles.hello}>Hello 👋</div>
          <div className={styles.gymName}>{gymName}</div>
        </div>
      </div>
    </header>
  );
};

