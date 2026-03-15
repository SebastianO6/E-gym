import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Users } from "lucide-react";
import styles from "./Dashboard.module.css";
import PlatformRevenue from "./PlatformRevenue";
import api from "../../api/axios";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [gyms, setGyms] = useState([]);
  const [users, setUsers] = useState([]);
  const [expiringGyms, setExpiringGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gymsRes, usersRes, expiringRes] = await Promise.all([
        api.get("/superadmin/gyms"),
        api.get("/superadmin/users"),
        api.get("/superadmin/gyms/expiring"),
      ]);

      setGyms(gymsRes.data || []);
      setUsers(usersRes.data || []);
      setExpiringGyms(expiringRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute stats dynamically
  const activeGyms = gyms.filter((g) => g.status === "active");
  const inactiveGyms = gyms.filter((g) => g.status !== "active");

  const stats = [
    { label: "Total Gyms", value: gyms.length, icon: Building },
    { label: "Active Gyms", value: activeGyms.length, icon: Building },
    { label: "Inactive Gyms", value: inactiveGyms.length, icon: Building },
    { label: "Total Users", value: users.length, icon: Users },
  ];

  if (loading) {
    return <div className={styles.container}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Superadmin Dashboard</h1>

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <s.icon size={22} />
            <div>
              <p>{s.label}</p>
              <h2>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <PlatformRevenue gyms={activeGyms} />

      <div className={styles.sectionCard}>
        <h3>⚠️ Gyms Expiring Soon</h3>
        {expiringGyms.length === 0 ? (
          <p>No gyms expiring soon.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gym</th>
                <th>Plan</th>
                <th>Days Left</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {expiringGyms.map((g) => (
                <tr key={g.gym_id}>
                  <td>{g.gym_name}</td>
                  <td>{g.plan}</td>
                  <td>{g.days_left}</td>
                  <td>
                    <button onClick={() => navigate(`/superadmin/gyms/${g.gym_id}`)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;