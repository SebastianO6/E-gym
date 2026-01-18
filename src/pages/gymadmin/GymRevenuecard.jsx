import React, { useEffect, useState } from "react";
import styles from "./GymRevenueCard.module.css";
import { getRevenueSummary } from "../../../services/revenueService";

export default function GymRevenueCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getRevenueSummary()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) return null;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>💰 Revenue</h3>

      <h1 className={styles.amount}>
        KES {data.total_revenue.toLocaleString()}
      </h1>

      <p className={styles.meta}>
        {data.active_members} active × 300 KES
      </p>

      {data.premium_members > 0 && (
        <p className={styles.meta}>
          + {data.premium_members} premium × 600 KES
        </p>
      )}
    </div>
  );
}
