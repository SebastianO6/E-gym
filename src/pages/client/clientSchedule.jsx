import { useEffect, useState } from "react";
import { getMySchedule } from "../../services/trainerServiceSchedule";
import styles from "./ClientSchedules.module.css"
const ClientSchedule = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getMySchedule()
      .then(setSessions)
      .catch(() => setSessions([]));
  }, []);

  if (!sessions.length)
    return <p style={{ padding: 12, textAlign: "center" }}>No upcoming sessions.</p>;

  return (
    <div className={styles.scheduleContainer}>
      <h2>My Training Sessions</h2>
      <div className={styles.scheduleGrid}>
        {sessions.map((s, i) => (
          <div key={i} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <span>{new Date(s.workout_date).toLocaleDateString()}</span>
              {s.start_time && (
                <span>
                  {s.start_time} - {s.end_time}
                </span>
              )}
            </div>
            <div>Status: <b className={s.status === "completed" ? styles.completed : styles.pending}>{s.status}</b></div>
            {s.notes && <small>{s.notes}</small>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSchedule;