import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Users, Activity } from "lucide-react";
import styles from "./Dashboard.module.css";
import { getAllGyms, getAllUsers } from "../../services/superadminService";
import PlatformRevenue from "./PlatformRevenue";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setGyms(await getAllGyms());
    setUsers(await getAllUsers());
  };

  const stats = [
    { label: "Total Gyms", value: gyms.length, icon: Building },
    { label: "Total Users", value: users.length, icon: Users },
    {
      label: "Gym Admins",
      value: users.filter((u) => u.role === "gymadmin").length,
      icon: Activity,
    },
  ];

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

      <PlatformRevenue />

      <button onClick={() => navigate("/superadmin/gyms")}>
        Manage Gyms →
      </button>
    </div>
  );
};

export default SuperAdminDashboard;
