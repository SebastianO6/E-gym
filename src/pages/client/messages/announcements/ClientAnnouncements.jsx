import React, { useEffect, useState } from "react";
import styles from "./ClientAnnouncements.module.css";
import api from "../../../../api/axios";
import { connectSocket } from "../../../../socket";
import { getAuthToken } from "../../../../utils/authLocal";

export default function ClientAnnouncements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = () =>
      api.get("/client/announcements")
        .then(res => setAnns(res.data || []))
        .catch(() => setAnns([]))
        .finally(() => setLoading(false));

    loadAnnouncements();

    const token = getAuthToken();
    const socket = connectSocket(token);

    if (!socket) {
      return undefined;
    }

    const refresh = () => loadAnnouncements();

    socket.on("announcement_created", refresh);
    socket.on("announcement_updated", refresh);
    socket.on("announcement_deleted", refresh);

    return () => {
      socket.off("announcement_created", refresh);
      socket.off("announcement_updated", refresh);
      socket.off("announcement_deleted", refresh);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gym Announcements</h1>

      {loading && <div style={{ padding: 20 }}>Loading updates...</div>}

      {!loading && anns.length === 0 && (
        <div className={styles.emptyState}>No announcements at this time.</div>
      )}

      <div className={styles.list}>
        {anns.map((a) => (
          <div key={a.id} className={styles.card}>
            <h4 className={styles.cardTitle}>{a.title}</h4>
            <p className={styles.message}>{a.message}</p>
            <span className={styles.date}>
              {new Date(a.created_at).toLocaleString("en-KE", {
                timeZone: "Africa/Nairobi",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
