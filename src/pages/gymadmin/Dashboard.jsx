import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../../services/gymAdminService";
import api from "../../api/axios";

const GymAdminDashboard = () => {
  const navigate = useNavigate();

  /* =======================
     STATE
  ======================= */
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    revenue: 0,
    upcomingSessions: 0,
  });

  /* =======================
     LOAD QUICK STATS
  ======================= */
  const loadQuickStats = useCallback(async () => {
    try {
      const [revenueRes, sessionsRes] = await Promise.all([
        api.get("/gymadmin/revenue"),
        api.get("/api/schedules?limit=5"),
      ]);

      setQuickStats({
        revenue: revenueRes?.data?.total_revenue ?? 0,
        upcomingSessions: Array.isArray(sessionsRes?.data)
          ? sessionsRes.data.length
          : 0,
      });
    } catch (err) {
      console.error("Quick stats error:", err);
      setQuickStats({
        revenue: 0,
        upcomingSessions: 0,
      });
    }
  }, []);

  /* =======================
     LOAD DASHBOARD
  ======================= */
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboardSummary();
      setSummary(data ?? {});
      await loadQuickStats();
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setSummary({});
    } finally {
      setLoading(false);
    }
  }, [loadQuickStats]);

  /* =======================
     EFFECT
  ======================= */
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* =======================
     DERIVED DATA
  ======================= */
  const members = summary?.members ?? { total: 0 };
  const trainers = summary?.trainers ?? { total: 0, workload: [] };

  const avgWorkload = useMemo(() => {
    const workload = Array.isArray(trainers.workload)
      ? trainers.workload
      : [];

    if (!workload.length) return 0;

    const total = workload.reduce(
      (sum, t) => sum + (t?.member_count ?? 0),
      0
    );

    return Math.round(total / workload.length);
  }, [trainers.workload]);

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <div className={styles.container}>
      <h1>🏋️ Gym Dashboard</h1>

      <div className={styles.statsGrid}>
        <div
          className={styles.statCard}
          onClick={() => navigate("/gymadmin/members")}
        >
          <h2>{members.total}</h2>
          <p>Members</p>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/gymadmin/revenue")}
        >
          <h2>${quickStats.revenue.toLocaleString()}</h2>
          <p>Revenue</p>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/gymadmin/trainers")}
        >
          <h2>{trainers.total}</h2>
          <p>Trainers</p>
          <span>Avg workload: {avgWorkload}</span>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/gymadmin/schedules")}
        >
          <h2>{quickStats.upcomingSessions}</h2>
          <p>Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default GymAdminDashboard;
