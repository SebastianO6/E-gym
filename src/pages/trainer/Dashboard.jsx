import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Clock,
  Plus,
} from "lucide-react";
import api from "../../api/axios";

const TrainerDashboard = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [membersRes, scheduleRes, announcementRes] =
        await Promise.all([
          api.get("/trainer/members"),
          api.get("/schedules/trainer"),
          api.get("/announcements?role=trainer")
        ]);

      setMembers(membersRes.data.items || []);
      setSessions(scheduleRes.data || []);
      setAnnouncements(announcementRes.data.items || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todaySessions = sessions.filter((s) => {
    if (!s.start_time) return false;
    const date = new Date(s.start_time);
    if (isNaN(date)) return false;
    return date.toISOString().split("T")[0] === today;
  });



  const stats = [
    {
      label: "Assigned Members",
      value: members.length,
      icon: Users,
      color: "#2563eb",
      bg: "#eff6ff",
    },
    {
      label: "Today's Sessions",
      value: todaySessions.length,
      icon: Calendar,
      color: "#7c3aed",
      bg: "#ffffff",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Trainer Dashboard</h1>
        <p className={styles.subtitle}>
          Overview of your training activity.
        </p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={styles.statCard}>
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <h3>{stat.value}</h3>
              </div>
              <div
                className={styles.iconWrapper}
                style={{ background: stat.bg, color: stat.color }}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.actionsGrid}>
        <button
          className={styles.actionBtn}
          onClick={() => navigate("/trainer/members")}
        >
          <Users size={24} />
          My Members
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => navigate("/trainer/plans/create")}
        >
          <Plus size={24} />
          Create Plan
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => navigate("/trainer/schedule")}
        >
          <Calendar size={24} />
          View Schedule
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => navigate("/trainer/messages")}
        >
          <MessageSquare size={24} />
          Messages
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>
          <FileText size={18} />
          Latest Announcements
        </h2>

        {announcements.length === 0 ? (
          <p className={styles.muted}>No announcements available</p>
        ) : (
          <div className={styles.announcementList}>
            {announcements.slice(0, 3).map((item) => (
              <div key={item.id} className={styles.announcementItem}>
                <div className={styles.announcementIcon}>
                  <MessageSquare size={16} />
                </div>

                <div className={styles.announcementContent}>
                  <h4>{item.title}</h4>
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Today Sessions */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>
          <Clock size={18} /> Today’s Sessions
        </h2>

        {todaySessions.length === 0 ? (
          <p className={styles.muted}>No sessions today</p>
        ) : (
          todaySessions.slice(0, 2).map((s) => (
            <div key={s.id} className={styles.sessionItem}>
              <div>
                <h4>{s.member_name}</h4>

                <p className={styles.sessionMeta}>
                  {s.plan_title}
                </p>

                <p className={styles.sessionDate}>
                  {new Date(s.start_time).toLocaleDateString()}
                </p>
              </div>

              <button
                className={styles.startBtn}
                onClick={() => navigate("/trainer/schedule")}
              >
                Open
              </button>
            </div>
          ))
        )}

        {todaySessions.length > 2 && (
          <button
            className={styles.viewAllBtn}
            onClick={() => navigate("/trainer/schedule")}
          >
            View Full Schedule →
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
