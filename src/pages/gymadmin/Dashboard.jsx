import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getRevenueSummary,
  getRevenueSeries,
  listMembers,
  getMember,
} from "../../services/gymAdminService";
import styles from "./Dashboard.module.css";

const DAYS_WARNING = 3;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardSummary, revenueSummary, members] =
        await Promise.all([
          getDashboardSummary(),
          getRevenueSummary(),
          listMembers(),
        ]);

      setSummary(dashboardSummary);
      setRevenue(revenueSummary);

      // Revenue series should NEVER block dashboard
      try {
        const series = await getRevenueSeries();
        setRevenueSeries(series);
      } catch (e) {
        console.warn("Revenue series unavailable");
        setRevenueSeries([]);
      }

      loadExpiringMembers(members);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };


  const loadExpiringMembers = async (members) => {
    const today = new Date();
    const soon = [];

    for (const m of members) {
      try {
        const full = await getMember(m.id);
        const sub = full.subscription;

        if (!sub || !sub.end_date) continue;

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
        // ignore broken member
      }
    }

    setExpiringMembers(soon);
  };

  if (loading) {
    return <p className={styles.loading}>Loading dashboard…</p>;
  }

  if (!summary || !revenue) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }


  

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Gym Dashboard</h1>

      {/* STATS */}
      <div className={styles.cards}>
        <StatCard label="Members" value={summary.members} />
        <StatCard label="Trainers" value={summary.trainers} />

        <StatCard
          label="Active Members"
          value={revenue.active_members}
        />
        <StatCard
          label="Total Revenue"
          value={`KES ${revenue.total_revenue}`}
        />
      </div>

      {/* EXPIRING MEMBERS */}
      <section className={styles.section}>
        <h2>⚠️ Memberships Expiring Soon</h2>

        {expiringMembers.length === 0 ? (
          <p>No memberships expiring in the next {DAYS_WARNING} days.</p>
        ) : (
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
                  <td className={styles.warning}>
                    {m.daysLeft}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* REVENUE */}
      <section className={styles.section}>
        <h2>Revenue Overview</h2>

        <div className={styles.revenueRow}>
          <div>
            <strong>Daily price:</strong> KES {revenue?.daily_price ?? 0}          </div>
          <div>
            <strong>Monthly price:</strong> KES {revenue?.monthly_price ?? 0}
          </div>
        </div>

        <RevenuePreview data={revenueSeries} />
      </section>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */

function StatCard({ label, value }) {
  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
    </div>
  );
}

function RevenuePreview({ data }) {
  if (!data.length) return <p>No revenue data</p>;

  return (
    <ul className={styles.revenueList}>
      {data.slice(-7).map((d) => (
        <li key={d.date}>
          {d.date}: <strong>KES {d.amount}</strong>
        </li>
      ))}
    </ul>
  );
}
