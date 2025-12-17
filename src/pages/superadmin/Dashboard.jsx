import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Building, Activity, ChevronRight } from "lucide-react";
import styles from "./Dashboard.module.css";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // Mock stats
  const stats = [
    { label: "Total Gyms", value: 32, icon: Building, bg: "#dbeafe", color: "#2563eb" },
    { label: "Active Gyms", value: 27, icon: Activity, bg: "#d1fae5", color: "#059669" },
    { label: "Pending Approvals", value: 5, icon: Users, bg: "#fef3c7", color: "#d97706" },
    { label: "Total Revenue", value: "$254,000", icon: TrendingUp, bg: "#f3e8ff", color: "#7c3aed" },
  ];

  const recentGyms = [
    { id: 1, name: "Titan Fitness", owner: "Joseph Kariuki", status: "pending" },
    { id: 2, name: "Muscle Lab", owner: "Emmanuel Kamau", status: "active" },
    { id: 3, name: "Flex Arena", owner: "Naomi Otieno", status: "active" },
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return styles.badgeActive;
      case 'pending': return styles.badgePending;
      case 'suspended': return styles.badgeSuspended;
      default: return styles.badge;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Superadmin Dashboard</h1>
        <p className={styles.subtitle}>Overview of all gyms on the platform.</p>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={styles.statCard}>
              <div>
                <p className={styles.statLabel}>{s.label}</p>
                <h2 className={styles.statValue}>{s.value}</h2>
              </div>
              <div className={styles.iconWrapper} style={{ backgroundColor: s.bg, color: s.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT GYMS */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recently Added Gyms</h2>
          <button 
            className={styles.viewAllBtn}
            onClick={() => navigate('/superadmin/gyms')}
          >
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gym</th>
                <th>Owner</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentGyms.map((g) => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 500 }}>{g.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{g.owner}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusClass(g.status)}`}>
                      {g.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => navigate(`/superadmin/gyms/${g.id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;