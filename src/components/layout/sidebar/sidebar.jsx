import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./sidebar.module.css";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  TrendingUp,
  LogOut  // ✅ Add this import
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";  // ✅ Import auth context

const Sidebar = ({ userRole }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();  // ✅ Get logout function

  const menuItemsByRole = {
    superadmin: [
      { label: "Overview", icon: LayoutDashboard, to: "/superadmin" },
      { label: "Gyms", icon: Building2, to: "/superadmin/gyms" },
      { label: "Analytics", icon: TrendingUp, to: "/superadmin/analytics" },
      { label: "Billing", icon: Bell, to: "/superadmin/billing" },
      { label: "Settings", icon: Settings, to: "/superadmin/settings" },
    ],
    gymadmin: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/gymadmin" },
      { label: "Clients", icon: Users, to: "/gymadmin/members" },
      { label: "Trainers", icon: Users, to: "/gymadmin/trainers" }, 
      { label: "Announcements", icon: Bell, to: "/gymadmin/announcements" },
      { label: "Settings", icon: Settings, to: "/gymadmin/settings" },
    ],
    trainer: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/trainer" },
      { label: "Clients", icon: Users, to: "/trainer/members" },
      { label: "Plans", icon: TrendingUp, to: "/trainer/plans/create" },
      { label: "Schedule", icon: Bell, to: "/trainer/schedule" },
      { label: "Messages", icon: Bell, to: "/trainer/messages" },
    ],
    client: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/client" },
      { label: "My Plan", icon: TrendingUp, to: "/client/plan" },
      { label: "Messages", icon: Bell, to: "/client/messages" },
      { label: "My Schedule", icon: Bell, to: "/client/schedule" },
      { label: "Announcements", icon: Bell, to: "/client/announcements" },
      { label: "Settings", icon: Settings, to: "/client/settings" }, 
    ],
  };

  const navItems = menuItemsByRole[userRole] || [];

  // ✅ Handle logout
  const handleLogout = () => {
    logout();  // This will clear auth and redirect to login
  };

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
      <div className={styles.topSection}>
        {open && <h2 className={styles.logo}>GymFlow</h2>}
        <button className={styles.toggleBtn} onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = location.pathname.startsWith(to);
          return (
            <div 
              key={to} 
              className={`${styles.navItem} ${active ? styles.active : ""}`} 
              onClick={() => navigate(to)}
            >
              <Icon size={20} />
              {open && <span>{label}</span>}
            </div>
          );
        })}
        
        {/* ✅ Logout Button - Always visible at bottom */}
        <div 
          className={`${styles.navItem} ${styles.logoutItem}`} 
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </div>
      </nav>

      {open && (
        <div className={styles.profileSection}>
          <div className={styles.avatar}>{userRole?.[0]?.toUpperCase()}</div>
          <p className={styles.role}>{userRole}</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;