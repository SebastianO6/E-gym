// src/components/layout/sidebar/sidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./sidebar.module.css";

import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Bell,
  Settings,
  Menu,
  X,
  TrendingUp,
  Calendar,
  MessageCircle,
  ClipboardList,
  Dumbbell
} from "lucide-react";

const Sidebar = ({ userRole }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  /** -------------------------------------------------
   * MENU DEFINITIONS PER USER ROLE
   --------------------------------------------------*/
  const menuItemsByRole = {
    superadmin: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/superadmin" },
      { id: "gyms", label: "Gyms", icon: Building2, path: "/superadmin/gyms" },
      { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/superadmin/analytics" },
      { id: "billing", label: "Billing", icon: CreditCard, path: "/superadmin/billing" },
      { id: "settings", label: "Settings", icon: Settings, path: "/superadmin/settings" }
    ],

    gymadmin: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/gymadmin" },
      { id: "members", label: "Members", icon: Users, path: "/gymadmin/members" },
      { id: "trainers", label: "Trainers", icon: Dumbbell, path: "/gymadmin/trainers" },
      { id: "payments", label: "Payments", icon: CreditCard, path: "/gymadmin/payments" },
      { id: "announcements", label: "Announcements", icon: Bell, path: "/gymadmin/announcements" },
      { id: "settings", label: "Settings", icon: Settings, path: "/gymadmin/settings" }
    ],

    trainer: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/trainer" },
      { id: "members", label: "My Members", icon: Users, path: "/trainer/members" },
      { id: "messages", label: "Messages", icon: MessageCircle, path: "/trainer/messages" },
      { id: "schedule", label: "Schedule", icon: Calendar, path: "/trainer/schedule" },
      { id: "plans", label: "Create Plan", icon: ClipboardList, path: "/trainer/plans/create" },
      { id: "settings", label: "Settings", icon: Settings, path: "/trainer/settings" }
    ],

    client: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/client" },
      { id: "plan", label: "My Plan", icon: ClipboardList, path: "/client/plan" },
      { id: "messages", label: "Messages", icon: MessageCircle, path: "/client/messages" },
      { id: "announcements", label: "Announcements", icon: Bell, path: "/client/announcements" },
      { id: "settings", label: "Settings", icon: Settings, path: "/client/settings" }
    ]
  };

  const navItems = menuItemsByRole[userRole] || [];

  /** ---------------------------------------------
   * Detect active tab based on current URL
   ----------------------------------------------*/
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
      {/* Top / Logo Row */}
      <div className={styles.topSection}>
        {open && <h2 className={styles.logo}>GymFlow</h2>}

        <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} className={styles.icon} />
              {open && <span>{item.label}</span>}
            </div>
          );
        })}
      </nav>

      {/* Profile Section */}
      {open && (
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {userRole?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.name}>
              {userRole === "superadmin"
                ? "Super Admin"
                : userRole === "gymadmin"
                ? "Gym Admin"
                : userRole === "trainer"
                ? "Trainer"
                : "Client"}
            </p>
            <p className={styles.role}>{userRole}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
  