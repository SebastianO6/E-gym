import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Users, Activity } from "lucide-react";
import styles from "./Dashboard.module.css";
import { getAllGyms, getAllUsers } from "../../services/superadminService";
import PlatformRevenue from "./PlatformRevenue";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const [gymsData, usersData] = await Promise.all([
        getAllGyms(),
        getAllUsers(),
      ]);

      setGyms(gymsData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Gyms",
      value: gyms.length,
      icon: Building,
    },
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
    },
    {
      label: "Gym Admins",
      value: users.filter((u) => u.role === "gymadmin").length,
      icon: Users,
    },
    {
      label: "Trainers",
      value: users.filter((u) => u.role === "trainer").length,
      icon: Users,
    },
    {
      label: "Clients",
      value: users.filter((u) => u.role === "client").length,
      icon: Users,
    },
  ];


  if (loading) {
    return <div className={styles.container}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Superadmin Dashboard</h1>

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <s.icon size={22} />
            <div>
              <p>{s.label}</p>
              <h2>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <PlatformRevenue />

      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Recent Gyms</h3>
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/superadmin/gyms")}
          >
            View All
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {gyms.slice(0, 5).map((gym) => (
                <tr key={gym.id}>
                  <td>{gym.name}</td>
                  <td>{gym.email}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        gym.status === "active"
                          ? styles.badgeActive
                          : styles.badgePending
                      }`}
                    >
                      {gym.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button onClick={() => navigate("/superadmin/gyms")}>
        Manage Gyms →
      </button>
    </div>
  );
};

export default SuperAdminDashboard;
