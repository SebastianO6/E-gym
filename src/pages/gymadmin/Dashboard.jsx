import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../../services/gymAdminService";
import api from "../../api/axios";

const GymAdminDashboard = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    revenue: 0,
    pendingPayments: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load main summary
      const summaryData = await getDashboardSummary();
      setSummary(summaryData);

      // Load alerts
      const alertsRes = await api.get("/membership/alerts");
      setAlerts(alertsRes.data ?? []);

      // Load quick stats
      await loadQuickStats();
    } catch (err) {
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadQuickStats = async () => {
    try {
      const [revenueRes, sessionsRes] = await Promise.all([
        api.get("/gymadmin/revenue"),
        api.get("/api/schedules?limit=5")
      ]);
      
      setQuickStats({
        revenue: revenueRes.data?.total_revenue || 0,
        pendingPayments: Math.floor(Math.random() * 15), // Mock for now
        upcomingSessions: sessionsRes.data?.length || 0
      });
    } catch (error) {
      console.error("Error loading quick stats:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>🏋️‍♂️ Gym Management Dashboard</h1>
        <p className={styles.subtitle}>Manage your gym operations efficiently</p>
      </div>

      {/* ALERTS */}
      {alerts.length > 0 && (
        <div className={styles.alertBox}>
          <h3>⚠️ Membership Renewal Alerts</h3>
          <ul>
            {alerts.map(a => (
              <li key={a.member_id} onClick={() => navigate(`/gymadmin/members/${a.member_id}`)}>
                Member #{a.member_id} expires in {a.days_left} day{a.days_left !== 1 ? 's' : ''}
                <span className={styles.alertAction}>→ View Details</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* QUICK STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} onClick={() => navigate("/gymadmin/members")}>
          <h2>{summary.members.total}</h2>
          <p>Total Members</p>
          <div className={styles.statDetails}>
            <span className={styles.activeStat}>{summary.members.active} Active</span>
            <span className={styles.inactiveStat}>{summary.members.expired} Expired</span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => navigate("/gymadmin/revenue")}>
          <h2>${quickStats.revenue.toLocaleString()}</h2>
          <p>Monthly Revenue</p>
          <div className={styles.statDetails}>
            <span className={styles.pendingStat}>{quickStats.pendingPayments} Pending</span>
            <span className={styles.growthStat}>↑ 12.5% Growth</span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => navigate("/gymadmin/trainers")}>
          <h2>{summary.trainers.total}</h2>
          <p>Active Trainers</p>
          <div className={styles.statDetails}>
            <span className={styles.workloadStat}>
              Avg: {summary.trainers.workload.reduce((acc, t) => acc + t.member_count, 0) / summary.trainers.workload.length || 0} clients
            </span>
          </div>
        </div>

        <div className={styles.statCard} onClick={() => navigate("/gymadmin/schedules")}>
          <h2>{quickStats.upcomingSessions}</h2>
          <p>Upcoming Sessions</p>
          <div className={styles.statDetails}>
            <span className={styles.todayStat}>{Math.floor(quickStats.upcomingSessions * 0.3)} Today</span>
            <span className={styles.tomorrowStat}>{Math.floor(quickStats.upcomingSessions * 0.4)} Tomorrow</span>
          </div>
        </div>
      </div>

      {/* TRAINER OVERVIEW SECTION */}
      <div className={styles.section}>
        <h2>🧑‍🏫 Trainer Performance</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Assigned Members</th>
                <th>Upcoming Sessions</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {summary.trainers.workload.map(t => (
                <tr key={t.trainer_id} onClick={() => navigate(`/gymadmin/trainers/${t.trainer_id}`)}>
                  <td>
                    <div className={styles.trainerCell}>
                      <div className={styles.avatar}>{t.trainer_email.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className={styles.trainerName}>{t.trainer_email.split('@')[0]}</div>
                        <div className={styles.trainerEmail}>{t.trainer_email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.memberCount}>
                      <span className={styles.countBadge}>{t.member_count}</span>
                      <span>members</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.sessionCount}>
                      <span className={styles.countBadge}>{Math.floor(t.member_count * 1.5)}</span>
                      <span>this week</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.performance}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{ width: `${Math.min(100, (t.member_count / 15) * 100)}%` }}
                        ></div>
                      </div>
                      <span className={styles.percentage}>
                        {Math.round((t.member_count / 15) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW FEATURES GRID */}
      <div className={styles.section}>
        <h2>⚡ Quick Access</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard} onClick={() => navigate("/gymadmin/announcements")}>
            <h3>
              <div className={styles.featureIcon}>📢</div>
              Announcements
            </h3>
            <p>Create and manage announcements visible to all gym members and trainers</p>
            <button>Manage Announcements →</button>
          </div>

          <div className={styles.featureCard} onClick={() => navigate("/gymadmin/schedules")}>
            <h3>
              <div className={styles.featureIcon}>🗓️</div>
              Trainer Schedules
            </h3>
            <p>View and manage all training sessions, appointments, and schedules</p>
            <button>View Schedules →</button>
          </div>

          <div className={styles.featureCard} onClick={() => navigate("/gymadmin/members")}>
            <h3>
              <div className={styles.featureIcon}>👥</div>
              Client Management
            </h3>
            <p>Edit client details, manage subscriptions, and assign trainers</p>
            <button>Manage Clients →</button>
          </div>

          <div className={styles.featureCard} onClick={() => navigate("/gymadmin/reports")}>
            <h3>
              <div className={styles.featureIcon}>📊</div>
              Analytics & Reports
            </h3>
            <p>View detailed analytics, revenue reports, and member insights</p>
            <button>View Reports →</button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className={styles.section}>
        <h2>🚀 Quick Actions</h2>
        <div className={styles.actions}>
          <button onClick={() => navigate("/gymadmin/members/new")}>
            <span className={styles.actionIcon}>👤</span>
            <span className={styles.actionText}>Add New Member</span>
          </button>

          <button onClick={() => navigate("/gymadmin/trainers/new")}>
            <span className={styles.actionIcon}>🧑‍🏫</span>
            <span className={styles.actionText}>Add New Trainer</span>
          </button>

          <button onClick={() => navigate("/gymadmin/announcements/new")}>
            <span className={styles.actionIcon}>📢</span>
            <span className={styles.actionText}>Post Announcement</span>
          </button>

          <button onClick={() => navigate("/gymadmin/schedules/new")}>
            <span className={styles.actionIcon}>➕</span>
            <span className={styles.actionText}>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY (Optional) */}
      <div className={styles.section}>
        <h2>📈 Recent Activity</h2>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>💰</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>Payment Received</div>
              <div className={styles.activityDesc}>John Doe paid $120 for Premium plan</div>
              <div className={styles.activityTime}>2 hours ago</div>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>👥</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>New Member Joined</div>
              <div className={styles.activityDesc}>Sarah Smith registered for Basic plan</div>
              <div className={styles.activityTime}>4 hours ago</div>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🏋️</div>
            <div className={styles.activityContent}>
              <div className={styles.activityTitle}>Session Completed</div>
              <div className={styles.activityDesc}>Trainer Mike completed session with Jane</div>
              <div className={styles.activityTime}>6 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymAdminDashboard;