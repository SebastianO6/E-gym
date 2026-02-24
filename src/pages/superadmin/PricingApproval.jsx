import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PricingApproval() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/superadmin/pricing/pending")
      .then(res => {
        setPending(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    await api.post(`/superadmin/pricing/${id}/approve`);
    setPending(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <p>Loading...</p>;
  if (!pending.length) return <p>No pending pricing approvals</p>;

  return (
    <div>
      <h2>Pending Pricing Approvals</h2>
      <table>
        <thead>
          <tr>
            <th>Gym</th>
            <th>Daily</th>
            <th>Monthly</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map(p => (
            <tr key={p.id}>
              <td>{p.gym_name}</td>
              <td>{p.daily_price}</td>
              <td>{p.monthly_price}</td>
              <td>
                <button onClick={() => approve(p.id)}>Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
