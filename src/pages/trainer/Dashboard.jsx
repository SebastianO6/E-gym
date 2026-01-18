import React from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Calendar, MessageSquare, Clock, Plus, ChevronRight } from "lucide-react";
import TrainerWeeklySchedule from "./schedule/TrainerWeeklySchedule";

const TrainerDashboard = () => {
  const navigate = useNavigate();

  // Mock metrics
  const stats = [
    { label: "Assigned Members", value: 18, icon: Users, color: "#2563eb", bg: "#eff6ff" },
    { label: "Active Plans", value: 12, icon: FileText, color: "#059669", bg: "#d1fae5" },
    { label: "Today's Sessions", value: 4, icon: Calendar, color: "#7c3aed", bg: "#f3e8ff" },
  ];

  const todaySessions = [
    { id: 1, member: "Brian Kim", time: "9:00 AM" },
    { id: 2, member: "Alice Nora", time: "11:30 AM" },
    { id: 3, member: "Samuel Otieno", time: "3:00 PM" },
    { id: 4, member: "Janet Kuria", time: "5:00 PM" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Trainer Dashboard</h1>
        <p className={styles.subtitle}>Overview of your training activity and schedule.</p>
      </div>

      <TrainerWeeklySchedule />

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={styles.statCard}>
              <div className={styles.statInfo}>
                <p className={styles.statLabel}>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
              <div className={styles.iconWrapper} style={{ background: stat.bg, color: stat.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className={styles.actionsGrid}>
        <button className={styles.actionBtn} onClick={() => navigate("/trainer/members")}>
          <Users size={24} className="text-blue-600" />
          <span>My Members</span>
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/plans/create")}>
          <Plus size={24} className="text-green-600" />
          <span>Create Plan</span>
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/schedule")}>
          <Calendar size={24} className="text-purple-600" />
          <span>View Schedule</span>
        </button>

        <button className={styles.actionBtn} onClick={() => navigate("/trainer/messages")}>
          <MessageSquare size={24} className="text-orange-600" />
          <span>Messages</span>
        </button>
      </div>

      {/* Today's Sessions */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>
          <Clock size={20} />
          Today’s Training Sessions
        </h2>

        {todaySessions.length === 0 ? (
          <p className={styles.muted}>No sessions scheduled today.</p>
        ) : (
          <div className={styles.sessionList}>
            {todaySessions.map((s) => (
              <div key={s.id} className={styles.sessionItem}>
                <div className={styles.sessionInfo}>
                  <h4>{s.member}</h4>
                  <p className={styles.time}>
                    <Clock size={14} /> {s.time}
                  </p>
                </div>
                <button
                  className={styles.startBtn}
                  onClick={() => navigate(`/trainer/members/${s.id}`)}
                >
                  View Member <ChevronRight size={14} style={{ marginLeft: 4, display: 'inline' }} />
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