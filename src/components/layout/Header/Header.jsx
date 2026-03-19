import React from "react";
import styles from "./Header.module.css";
import {  Menu } from "lucide-react"

export default function Header ({ activeTab, toggleSidebar }) {

  return (
    <header className={styles.header}>
      <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
        <Menu size={22} />
      </button>


      <div className={styles.right}>
        <div className={styles.greeting}>
          <div className={styles.hello}>Hello 👋</div>
        </div>
      </div>
    </header>
  );
};

