import React, { useEffect, useState } from "react";
import { getPlatformRevenue } from "../../services/superadminService";
import styles from "./PlatformRevenue.module.css";

export default function PlatformRevenue() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    currency: "KES",
    total_revenue: 0,
    gyms: [],
  });

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const res = await getPlatformRevenue();
        setRevenue(res);
      } catch (err) {
        console.error("Failed to load revenue", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenue();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading platform revenue...</p>;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Platform Revenue</h2>

      <h3 className={styles.total}>
        {revenue.currency} {revenue.total_revenue.toLocaleString()}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gym</th>
              <th>Location</th>
              <th>Members</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {revenue.gyms.map((gym) => (
              <tr key={gym.gym_id}>
                <td className={styles.gymName}>{gym.gym_name}</td>
                <td className={styles.location}>{gym.location}</td>
                <td>{gym.members}</td>
                <td className={styles.revenue}>
                  {revenue.currency} {gym.revenue_ksh.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}