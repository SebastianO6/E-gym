import { useEffect, useState, useCallback } from "react";
import { getDashboardSummary, getRevenueSummary, listMembers } from "../../services/gymAdminService";
import api from "../../api/axios";
import styles from "./Dashboard.module.css";

const DAYS_WARNING = 3;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [activeMembers, setActiveMembers] = useState(0);
  const [inactiveMembers, setInactiveMembers] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load members and compute statuses
  const loadMembers = useCallback(async () => {
    try {
      const members = await listMembers();
      const today = new Date();

      const active = members.filter(m => m.status === "active");
      const inactive = members.filter(m => m.status !== "active");

      setActiveMembers(active.length);
      setInactiveMembers(inactive.length);

      // Expiring soon
      const soon = active
        .filter(m => m.subscription?.end_date)
        .map(m => ({
          ...m,
          daysLeft: Math.ceil(
            (new Date(m.subscription.end_date) - today) / (1000 * 60 * 60 * 24)
          )
        }))
        .filter(m => m.daysLeft <= DAYS_WARNING && m.daysLeft >= 0);

      setExpiringMembers(soon);

      // Expired members
      const expiredRes = await api.get("/gymadmin/members/expired");
      setExpiredCount(expiredRes.data.items?.length || 0);
    } catch (err) {
      console.error("Failed to load members data", err);
    }
  }, []);

  // Load dashboard summary, revenue, announcements
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardSummary, revenueSummary, annRes] = await Promise.all([
        getDashboardSummary(),
        getRevenueSummary(),
        api.get("/gymadmin/announcements"),
      ]);

      setSummary(dashboardSummary);
      setRevenue(revenueSummary);
      setAnnouncements(annRes.data.items || []);

      await loadMembers();
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }, [loadMembers]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Deactivate member
  const handleDeactivate = async (memberId) => {
    if (!window.confirm("Deactivate this member?")) return;
    try {
      await api.patch(`/gymadmin/members/${memberId}/deactivate`);
      // Refresh UI
      await loadMembers();
      await loadDashboard();
      // Optionally redirect to expired members
      window.location.href = "/gymadmin/members/expired";
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate member");
    }
  };

  if (loading) return <div className={styles.loading}>Loading dashboard…</div>;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Gym Dashboard</h1>

      <div className={styles.cards}>
        <StatCard label="Total Members" value={summary?.members} />
        <StatCard label="Active Members" value={activeMembers} />
        <StatCard label="Inactive Members" value={inactiveMembers} />
        <StatCard label="Trainers" value={summary?.trainers} />
        <StatCard label="Revenue" value={`KES ${revenue?.total_revenue}`} />
        <StatCard
          label="Expired Members"
          value={expiredCount}
          highlight={expiredCount > 0}
          link="/gymadmin/members/expired"
        />
      </div>

      {/* Expiring memberships */}
      <section className={styles.section}>
        <h2>⚠️ Memberships Expiring Soon</h2>
        {expiringMembers.length === 0 ? (
          <p className={styles.emptyState}>No memberships expiring soon.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Days Left</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expiringMembers.map(m => (
                  <tr key={m.id}>
                    <td>{m.email}</td>
                    <td>{m.subscription.plan}</td>
                    <td className={styles.warning}>{m.daysLeft}</td>
                    <td>
                      <button
                        className={styles.deactivateBtn}
                        onClick={() => handleDeactivate(m.id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Announcements */}
      <section className={styles.section}>
        <h2>📢 Announcements</h2>
        {announcements.length === 0 ? (
          <p className={styles.emptyState}>No announcements yet.</p>
        ) : (
          <div className={styles.announcementGrid}>
            {announcements.slice(0, 6).map(a => (
              <div key={a.id} className={styles.announcementCard}>
                <h3>{a.title}</h3>
                <p>{a.message}</p>
                <small>{new Date(a.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ label, value, highlight, link }) {
  return link ? (
    <a href={link} className={`${styles.statCard} ${highlight ? styles.highlight : ""}`}>
      <h2>{value}</h2>
      <p>{label}</p>
    </a>
  ) : (
    <div className={`${styles.statCard} ${highlight ? styles.highlight : ""}`}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}