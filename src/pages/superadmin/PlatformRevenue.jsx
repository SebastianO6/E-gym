import React, { useEffect, useState } from "react";
import { getPlatformRevenue } from "../../services/superadminService";

const PlatformRevenue = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      const res = await getPlatformRevenue();
      setData(res);
    } catch (err) {
      console.error("Failed to load platform revenue", err);
      setError("Failed to load revenue");
    }
  };

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading revenue...</p>;

  return (
    <div>
      <h2>Total Platform Revenue</h2>
      <h3>₹ {data.total_platform_revenue}</h3>

      <h4>Per Gym</h4>
      <ul>
        {data.per_gym.map((g) => (
          <li key={g.gym_id}>
            {g.gym_name} — {g.active_members} active members — ₹{g.platform_fee}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlatformRevenue;
