// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/sidebar";
import Header from "./Header/Header";
import styles from "./Layout.module.css";

const Layout = ({ userRole }) => {
  return (
    <div className={styles.container}>
      
      {/* Sidebar now navigates using URL, no activeTab needed */}
      <Sidebar userRole={userRole} />

      <div className={styles.contentWrapper}>
        
        {/* Header can read current page from URL or remain simple */}
        <Header />

        <main className={styles.mainContent}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;
