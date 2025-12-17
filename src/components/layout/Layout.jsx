// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import Header from "./Header/Header";
import { useAuth } from "../../context/AuthContext";
import styles from "./Layout.module.css";

export default function Layout() {
  const { auth } = useAuth();

  return (
    <div className={styles.container}>
      <Sidebar userRole={auth?.user?.role} />

      <div className={styles.contentWrapper}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
