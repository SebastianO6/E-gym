// src/components/layout/Header/Header.jsx
import React from "react";
import styles from "./Header.module.css";
import { getCurrentUser } from "../../../utils/authLocal";

const Header = ({ activeTab }) => {
  const user = getCurrentUser();
  const role = user?.role ?? "";
  const name = user?.name ?? user?.email ?? "";

  const avatarLetter =
    name && typeof name === "string" && name.length > 0
      ? name[0].toUpperCase()
      : "U";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h2>{activeTab ? activeTab.toUpperCase() : "DASHBOARD"}</h2>
      </div>

      <div className={styles.right}>
        <div className={styles.user}>
          <div className={styles.avatar}>{avatarLetter}</div>
          <div>
            <div className={styles.username}>{name}</div>
            <div className={styles.role}>{role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
