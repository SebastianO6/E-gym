import React from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const TrainerDashboard = () => {
  const navigate = useNavigate();

  // Mock metrics
  const stats = {
    members: 18,
    activePlans: 12,
    todaysSessions: 4,
  };

  const todaySessions = [
    { id: 1, member: "Brian Kim", time: "9:00 AM" },
    { id: 2, member: "Alice Nora", time: "11:30 AM" },
    { id: 3, member: "Samuel Otieno", time: "3:00 PM" },
    { id: 4, member: "Janet Kuria", time: "5:00 PM" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Trainer Dashboard</h1>
      <p className={styles.subtitle}>Overview of your training activity</p>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Assigned Members</p>
          <h3 className={styles.statValue}>{stats.members}</h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Active Plans</p>
          <h3 className={styles.statValue}>{stats.activePlans}</h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Today's Sessions</p>
          <h3 className={styles.statValue}>{stats.todaysSessions}</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={() => navigate("/trainer/members")}>
          View Members
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/plans/create")}>
          Create Training Plan
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/schedule")}>
          View Schedule
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/messages")}>
          Messages
        </button>
      </div>

      {/* Today's Sessions */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Today’s Training Sessions</h2>

        {todaySessions.length === 0 ? (
          <p className={styles.muted}>No sessions scheduled today.</p>
        ) : (
          <div className={styles.sessionList}>
            {todaySessions.map((s) => (
              <div key={s.id} className={styles.sessionItem}>
                <div>
                  <p className={styles.memberName}>{s.member}</p>
                  <p className={styles.time}>{s.time}</p>
                </div>
                <button
                  className={styles.startBtn}
                  onClick={() => navigate(`/trainer/members/${s.id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
