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

  return (
    <div>
      <h2>My Training Sessions</h2>

      {sessions.length === 0 && <p>No upcoming sessions.</p>}

      <ul>
        {sessions.map((s, i) => (
          <li key={i}>
            <b>{s.workout_date}</b>{" "}
            {s.start_time && `(${s.start_time} - ${s.end_time})`}
            <div>Status: {s.status}</div>
            {s.notes && <small>{s.notes}</small>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientSchedule;
