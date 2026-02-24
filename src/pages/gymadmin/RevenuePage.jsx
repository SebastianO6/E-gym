import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RevenuePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/gymadmin/revenue/series").then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Revenue Over Time</h2>

      <LineChart width={800} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line dataKey="amount" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
