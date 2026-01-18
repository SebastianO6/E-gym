import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const RevenueDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/revenue/summary").then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Revenue</h2>
      <p><b>Active Members:</b> {data.active_members}</p>
      <p><b>Monthly Revenue:</b> ${data.monthly_revenue}</p>
      <p><b>Total Revenue:</b> ${data.total_revenue}</p>
    </div>
  );
};

export default RevenueDashboard;
