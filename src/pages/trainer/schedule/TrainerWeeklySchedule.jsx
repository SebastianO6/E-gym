import { useEffect, useState } from "react";
import { listTrainerSchedules } from "../../../services/trainerServiceSchedule";
import api from "../../../api/axios"

const TrainerWeeklySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await listTrainerSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    try {
      await api.patch(`/schedules/${id}`, { status: "cancelled" });
      load(); // Reload the data
    } catch (error) {
      console.error("Failed to cancel schedule:", error);
    }
  };

  const markCompleted = async (id) => {
    try {
      await api.patch(`/schedules/${id}`, { status: "completed" });
      load(); // Reload the data
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading schedule...</p>;
  if (schedules.length === 0) return <p>No sessions scheduled.</p>;

  return (
    <div className="schedule-card">
      <h3>My Weekly Schedule</h3>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Member</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{new Date(s.workout_date).toLocaleDateString()}</td>
              <td>{s.member_name}</td>
              <td>{s.start_time || "-"}</td>
              <td>{s.end_time || "-"}</td>
              <td>{s.status || "scheduled"}</td>
              <td>{s.notes || "-"}</td>
              <td>
                <button onClick={() => markCompleted(s.id)}>✔</button>
                <button onClick={() => cancel(s.id)}>✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainerWeeklySchedule;