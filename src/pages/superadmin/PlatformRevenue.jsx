import React, { useEffect, useState } from "react";
import { getPlatformRevenue } from "../../services/superadminService";

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
    return <p>Loading platform revenue...</p>;
  }

  return (
    <div>
      <h2>Platform Revenue</h2>

      <h3>
        Total Revenue:{" "}
        <strong>
          {revenue.currency}{" "}
          {revenue.total_revenue.toLocaleString()}
        </strong>
      </h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Gym</th>
            <th>Location</th>
            <th>Members</th>
            <th>Revenue (KES)</th>
          </tr>
        </thead>
        <tbody>
          {revenue.gyms.map((gym) => (
            <tr key={gym.gym_id}>
              <td>{gym.gym_name}</td>
              <td>{gym.location}</td>
              <td>{gym.members}</td>
              <td>{gym.revenue_ksh.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}