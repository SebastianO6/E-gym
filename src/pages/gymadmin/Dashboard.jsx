import { useEffect, useState, useCallback } from "react";
import {
  getDashboardSummary,
  getRevenueSummary,
  listMembers,
  getMember,
} from "../../services/gymAdminService";
import api from "../../api/axios";
import styles from "./Dashboard.module.css";

const DAYS_WARNING = 3;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExpiringMembers = useCallback(async (members) => {
    const today = new Date();
    const soon = [];

    for (const m of members) {
      try {
        const full = await getMember(m.id);
        const sub = full.subscription;

        if (!sub?.end_date) continue;

        const end = new Date(sub.end_date);
        const daysLeft = Math.ceil(
          (end - today) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft <= DAYS_WARNING && daysLeft >= 0) {
          soon.push({
            id: m.id,
            email: m.email,
            plan: sub.plan,
            daysLeft,
          });
        }
      } catch {
        // silently ignore individual member errors
      }
    }

    setExpiringMembers(soon);
  }, []);

  // ✅ Memoized dashboard loader
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [dashboardSummary, revenueSummary, members, annRes] =
        await Promise.all([
          getDashboardSummary(),
          getRevenueSummary(),
          listMembers(),
          api.get("/announcements"),
        ]);

      setSummary(dashboardSummary);
      setRevenue(revenueSummary);
      setAnnouncements(annRes.data.items || []);

      await loadExpiringMembers(members);

    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }, [loadExpiringMembers]);

  // ✅ Safe useEffect
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  if (!summary || !revenue) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Gym Dashboard</h1>

      <div className={styles.cards}>
        <StatCard label="Members" value={summary.members} />
        <StatCard label="Trainers" value={summary.trainers} />
        <StatCard label="Active Members" value={revenue.active_members} />
        <StatCard label="Total Revenue" value={`KES ${revenue.total_revenue}`} />
      </div>

      <section className={styles.section}>
        <h2>⚠️ Memberships Expiring Soon</h2>

        {expiringMembers.length === 0 ? (
          <p>No memberships expiring in the next {DAYS_WARNING} days.</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringMembers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.email}</td>
                    <td>{m.plan}</td>
                    <td className={styles.warning}>{m.daysLeft}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>📢 Announcements</h2>

        {announcements.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No announcements yet.</p>
          </div>
        ) : (
          <div className={styles.announcementGrid}>
            {announcements.slice(0, 6).map((a) => (
              <div key={a.id} className={styles.announcementCard}>
                <div className={styles.announcementHeader}>
                  <h3>{a.title}</h3>
                  <span className={`${styles.tag} ${styles[a.tag]}`}>
                    {a.tag}
                  </span>
                </div>
                <p>{a.message}</p>
                <small>
                  {new Date(a.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className={styles.statCard}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}