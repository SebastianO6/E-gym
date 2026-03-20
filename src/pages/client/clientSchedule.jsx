import { useEffect, useState } from "react";

import { getMySchedule } from "../../services/trainerServiceSchedule";
import styles from "./ClientSchedules.module.css";

const formatSessionDate = (session) => {
  const value = session.workout_date || session.start;
  if (!value) return "Scheduled workout";

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "Scheduled workout"
    : parsed.toLocaleDateString();
};

const ClientSchedule = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      try {
        const data = await getMySchedule();
        if (!isMounted) return;
        setSessions(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) {
          setSessions([]);
        }
      }
    };

    loadSchedule();
    const intervalId = setInterval(loadSchedule, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (!sessions.length) {
    return <p style={{ padding: 12, textAlign: "center" }}>No upcoming sessions.</p>;
  }

  return (
    <div className={styles.scheduleContainer}>
      <h2>My Training Sessions</h2>
      <div className={styles.scheduleGrid}>
        {sessions.map((session) => (
          <div key={session.id} className={styles.sessionCard}>
            <div className={styles.sessionHeader}>
              <span>{formatSessionDate(session)}</span>
              {session.start_time && (
                <span>
                  {session.start_time} - {session.end_time}
                </span>
              )}
            </div>

            <div>
              Trainer: <b>{session.trainer_name || "Assigned trainer"}</b>
            </div>

            {session.plan_title && (
              <div>
                Workout: <b>{session.plan_title}</b>
              </div>
            )}

            <div>
              Status:{" "}
              <b className={session.status === "completed" ? styles.completed : styles.pending}>
                {session.status}
              </b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSchedule;
