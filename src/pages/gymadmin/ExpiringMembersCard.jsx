import React, { useEffect, useState } from "react";
import styles from "./ExpiringMembersCard.module.css";
import api from "../../../api/axios";

export default function ExpiringMembersCard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/membership/expiring")
      .then(res => setItems(res.data))
      .catch(() => setItems([]));
  }, []);

  if (!items.length) return null;

  return (
    <div className={styles.card}>
      <h3>⚠️ Expiring Memberships</h3>

      {items.slice(0, 5).map(m => (
        <p key={m.member_id}>
          Member #{m.member_id} — due {m.due_date}
        </p>
      ))}
    </div>
  );
}
