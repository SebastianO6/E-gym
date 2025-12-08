// src/components/layout/Header/Header.jsx
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const { pathname } = useLocation();
  const params = useParams();

  // Map route patterns to friendly titles
  const routeMap = [
    { match: /^\/superadmin$/, title: "Dashboard" },
    { match: /^\/superadmin\/gyms$/, title: "All Gyms" },
    { match: /^\/superadmin\/gyms\/\d+$/, title: "Gym Details" },
    { match: /^\/gymadmin$/, title: "Dashboard" },
    { match: /^\/gymadmin\/members$/, title: "Members" },
    { match: /^\/gymadmin\/members\/.+$/, title: "Member Details" },
    { match: /^\/trainer$/, title: "Dashboard" },
    { match: /^\/trainer\/members$/, title: "My Members" },
    { match: /^\/trainer\/members\/.+$/, title: "Member Profile" },
    { match: /^\/trainer\/plans\/create$/, title: "Create Training Plan" },
    { match: /^\/trainer\/schedule$/, title: "Schedule" },
    { match: /^\/trainer\/messages$/, title: "Messages" },
    { match: /^\/client$/, title: "Dashboard" },
  ];

  // Determine the friendly title
  const getTitle = () => {
    for (let route of routeMap) {
      if (route.match.test(pathname)) return route.title;
    }

    // Fallback: transform last path segment
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    const last = parts[parts.length - 1];
    return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const title = getTitle();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <button className={styles.iconBtn}>🔔</button>
        <button className={styles.iconBtn}>⚙️</button>
      </div>
    </header>
  );
};

export default Header;
