import { useEffect, useState } from "react";
import {
  listTrainerSchedules,
  updateSchedule
} from "../../../services/trainerServiceSchedule";
import RescheduleModal from "./RescheduleModal";

const TrainerSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [rescheduling, setRescheduling] = useState(null);

  const load = async () => {
    try {
      const data = await listTrainerSchedules();
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markCompleted = async (id) => {
    await updateSchedule(id, { status: "completed" });
    load();
  };

  const cancelSession = async (id) => {
    await updateSchedule(id, { status: "cancelled" });
    load();
  };

  return (
    <div>
      <h2>My Weekly Schedule</h2>

      {sessions.length === 0 && <p>No sessions scheduled.</p>}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Time</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {sessions.map(s => (
            <tr key={s.id}>
              <td>{s.workout_date}</td>
              <td>{s.member_name}</td>
              <td>
                {s.start_time
                  ? `${s.start_time} - ${s.end_time}`
                  : "—"}
              </td>
              <td>{s.status}</td>
              <td>
                {s.status === "scheduled" ||
                s.status === "rescheduled" ? (
                  <>
                    <button onClick={() => markCompleted(s.id)}>
                      Complete
                    </button>
                    <button onClick={() => setRescheduling(s)}>
                      Reschedule
                    </button>
                    <button onClick={() => cancelSession(s.id)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rescheduling && (
        <RescheduleModal
          session={rescheduling}
          onClose={() => setRescheduling(null)}
          onUpdated={load}
        />
      )}
    </div>
  );
};

export default TrainerSchedule;
