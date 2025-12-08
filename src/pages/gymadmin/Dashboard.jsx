import React from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const GymAdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Members", value: 312 },
    { label: "Active Subscriptions", value: 210 },
    { label: "Expired", value: 102 },
    { label: "Monthly Revenue", value: "KSH 155,000" },
  ];

  const recentMembers = [
    { id: 1, name: "Samuel Karanja", plan: "monthly" },
    { id: 2, name: "Joyce Mutheu", plan: "weekly" },
    { id: 3, name: "James Mwangi", plan: "daily" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gym Dashboard</h1>
      <p className={styles.subtitle}>Overview of your gym operations.</p>

      {/* STATS */}
      <div className={styles.statsGrid}>
        {stats.map((s, index) => (
          <div key={index} className={styles.statCard}>
            <h2>{s.value}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* RECENT MEMBERS */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Recent Members</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {recentMembers.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td className={styles.cap}>{m.plan}</td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/gymadmin/members/${m.id}`)}
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

export default GymAdminDashboard;
