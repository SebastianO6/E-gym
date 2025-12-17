import React, { useEffect, useState } from "react";
// import { getAnnouncements } from "../../../../services/clientService"; // Mocking
import styles from "./ClientAnnouncements.module.css";
import { Bell } from "lucide-react";

const MOCK_ANNS = [
  { id: 1, title: "Holiday Hours", message: "The gym will be closed on Dec 25th. Open regular hours on Dec 26th.", date: "2023-12-20" },
  { id: 2, title: "New Equipment", message: "We have installed 3 new squat racks in the main lifting area!", date: "2023-11-15" }
];

export default function ClientAnnouncements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
        setAnns(MOCK_ANNS);
        setLoading(false);
    }, 500);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gym Announcements</h1>
      
      {loading && <div style={{padding:20}}>Loading updates...</div>}
      
      {!loading && anns.length === 0 && (
        <div className={styles.emptyState}>No announcements at this time.</div>
      )}
      
      <div className={styles.list}>
        {!loading && anns.map((a) => (
            <div key={a.id} className={styles.card}>
            <h4 className={styles.cardTitle}>{a.title}</h4>
            <p className={styles.message}>{a.message}</p>
            <span className={styles.date}>{a.date}</span>
            </div>
        ))}
      </div>
    </div>
  );
}