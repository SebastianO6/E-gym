import React, { useEffect, useState } from "react";
import {
  getPlatformMemberGrowth,
  getPlatformRevenue,
} from "../../services/superadminService";
import styles from "./PlatformRevenue.module.css";

export default function PlatformRevenue() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({
    currency: "KES",
    total_revenue: 0,
    gyms: [],
  });
  const [growth, setGrowth] = useState([]);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const [revenueRes, growthRes] = await Promise.all([
          getPlatformRevenue(),
          getPlatformMemberGrowth(),
        ]);
        setRevenue(revenueRes);
        setGrowth(growthRes);
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
      <h2 className={styles.title}>Platform Billing</h2>

      <h3 className={styles.total}>
        {revenue.currency} {revenue.total_revenue.toLocaleString()}
      </h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gym</th>
              <th>Members</th>
              <th>Base</th>
              <th>Extra Members</th>
              <th>Extra Tiers</th>
              <th>Extra Cost</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {revenue.gyms.map((gym) => (
              <tr key={gym.gym_id}>
                <td className={styles.gymName}>{gym.gym_name}</td>
                <td>{gym.members}</td>
                <td>KES {gym.pricing_breakdown.base_price.toLocaleString()}</td>
                <td>{gym.pricing_breakdown.extra_members}</td>
                <td>{gym.pricing_breakdown.extra_tiers}</td>
                <td>KES {gym.pricing_breakdown.extra_cost.toLocaleString()}</td>
                <td className={styles.revenue}>
                  {revenue.currency} {gym.revenue_ksh.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tableWrapper} style={{ marginTop: 24 }}>
        <h3 className={styles.title}>Monthly Member Increase</h3>
        <p className={styles.subtitle}>
          Billing rule: first 50 active members cost KES 10,000, then each additional block of up to 50 members adds KES 10,000.
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Gym</th>
              <th>New Members</th>
              <th>Current Active Members</th>
              <th>Current Invoice</th>
            </tr>
          </thead>
          <tbody>
            {growth.map((row, index) => (
              <tr key={`${row.gym_id}-${row.month}-${index}`}>
                <td>{new Date(row.month).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</td>
                <td>{row.gym_name}</td>
                <td>{row.new_members}</td>
                <td>{row.active_members}</td>
                <td>KES {row.pricing_breakdown.final_price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
