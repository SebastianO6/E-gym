import { useEffect, useState, useCallback } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getDashboardSummary, getRevenueSeries, getRevenueSummary, listMembers } from "../../services/gymAdminService";
import api from "../../api/axios";
import { useAlert } from "../../context/AlertContext";
import styles from "./Dashboard.module.css";

const DAYS_WARNING = 3;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [activeMembers, setActiveMembers] = useState(0);
  const [inactiveMembers, setInactiveMembers] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useAlert();

  const loadMembers = useCallback(async () => {
    try {
      const members = await listMembers();
      const today = new Date();

      const active = members.filter((member) => member.status === "active");
      const inactive = members.filter((member) => member.status !== "active");

      setActiveMembers(active.length);
      setInactiveMembers(inactive.length);

      const soon = active
        .filter((member) => member.subscription?.end_date)
        .map((member) => ({
          ...member,
          daysLeft: Math.ceil(
            (new Date(member.subscription.end_date) - today) / (1000 * 60 * 60 * 24)
          ),
        }))
        .filter((member) => member.daysLeft <= DAYS_WARNING && member.daysLeft >= 0);

      setExpiringMembers(soon);

      const expiredRes = await api.get("/gymadmin/members/expired");
      setExpiredCount(expiredRes.data.items?.length || 0);
    } catch (err) {
      console.error("Failed to load members data", err);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [dashboardSummary, revenueSummary, revenueSeriesData] = await Promise.all([
        getDashboardSummary(),
        getRevenueSummary(),
        getRevenueSeries(),
      ]);

      setSummary(dashboardSummary);
      setRevenue(revenueSummary);
      setRevenueSeries(
        (revenueSeriesData || []).map((item) => ({
          ...item,
          shortDate: new Date(item.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
        }))
      );

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

  const handleDeactivate = async (memberId) => {
    if (!(await confirm("Deactivate this member?", { title: "Deactivate Member", confirmLabel: "Deactivate", type: "danger" }))) {
      return;
    }

    try {
      await api.patch(`/gymadmin/members/${memberId}/deactivate`);
      await loadDashboard();
      window.location.href = "/gymadmin/members/expired";
    } catch (err) {
      window.alert("Failed to deactivate member");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  const trainerLoad = (summary?.trainer_workload || []).map((trainer) => ({
    name: trainer.name || `Trainer #${trainer.trainer_id}`,
    members: trainer.members || 0,
  }));

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <div>
          <p className={styles.kicker}>Operations Overview</p>
          <h1 className={styles.title}>Gym Performance Dashboard</h1>
          <p className={styles.subtitle}>
            Track membership health, trainer workload, and revenue movement from one place.
          </p>
        </div>
      </div>

      <div className={styles.cards}>
        <StatCard label="Total Members" value={summary?.members ?? 0} />
        <StatCard label="Active Members" value={activeMembers} />
        <StatCard label="Inactive Members" value={inactiveMembers} />
        <StatCard label="Trainers" value={summary?.trainers ?? 0} />
        <StatCard label="Revenue" value={`KES ${Number(revenue?.total_revenue || 0).toLocaleString()}`} />
        <StatCard label="Expired Members" value={expiredCount} highlight={expiredCount > 0} link="/gymadmin/members/expired" />
      </div>

      <div className={styles.analyticsGrid}>
        <section className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Revenue Trend</h2>
              <p>Daily payment totals to help spot growth or decline quickly.</p>
            </div>
          </div>

          {revenueSeries.length === 0 ? (
            <p className={styles.emptyState}>No revenue data available yet.</p>
          ) : (
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="shortDate" tick={{ fill: "#475569", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="amount" stroke="#2563eb" fill="url(#revenueFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Trainer Workload</h2>
              <p>See how members are distributed across your trainer team.</p>
            </div>
          </div>

          {trainerLoad.length === 0 ? (
            <p className={styles.emptyState}>No trainer workload data available yet.</p>
          ) : (
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trainerLoad}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#475569", fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, "Assigned members"]} />
                  <Bar dataKey="members" fill="#0f766e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Memberships Expiring Soon</h2>
            <p>Act early to protect revenue and reduce churn.</p>
          </div>
        </div>

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
                {expiringMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.email}</td>
                    <td>{member.subscription.plan}</td>
                    <td className={styles.warning}>{member.daysLeft}</td>
                    <td>
                      <button className={styles.deactivateBtn} onClick={() => handleDeactivate(member.id)}>
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
    </div>
  );
}

function StatCard({ label, value, highlight, link }) {
  const className = `${styles.statCard} ${highlight ? styles.highlight : ""}`;

  if (link) {
    return (
      <a href={link} className={className}>
        <h2>{value}</h2>
        <p>{label}</p>
      </a>
    );
  }

  return (
    <div className={className}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}
