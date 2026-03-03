// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import Header from "./Header/Header";
import { useAuth } from "../../context/AuthContext";
import styles from "./Layout.module.css";
import { useState } from "react"; 

export default function Layout() {
  const { auth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar
        userRole={auth?.user?.role}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div
        className={`${styles.contentWrapper} ${
          sidebarOpen ? styles.expanded : styles.collapsed
        }`}
      >

        <Header toggleSidebar={() => setSidebarOpen(true)} />

        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}