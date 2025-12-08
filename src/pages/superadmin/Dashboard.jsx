import React from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // Mock stats (replace later with API)
  const stats = [
    { label: "Total Gyms", value: 32 },
    { label: "Active Gyms", value: 27 },
    { label: "Pending Approvals", value: 5 },
    { label: "Total Revenue", value: "$254,000" },
  ];

  const recentGyms = [
    { id: 1, name: "Titan Fitness", owner: "Joseph Kariuki", status: "pending" },
    { id: 2, name: "Muscle Lab", owner: "Emmanuel Kamau", status: "active" },
    { id: 3, name: "Flex Arena", owner: "Naomi Otieno", status: "active" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Superadmin Dashboard</h1>
      <p className={styles.subtitle}>Overview of all gyms on the platform.</p>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <h2>{s.value}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT GYMS */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Recently Added Gyms</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gym</th>
              <th>Owner</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {recentGyms.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.owner}</td>
                <td>
                  <span className={`${styles.status} ${styles[g.status]}`}>
                    {g.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/superadmin/gyms/${g.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
