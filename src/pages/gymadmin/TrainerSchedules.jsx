import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./TrainerSchedules.module.css";

export default function TrainerSchedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [schedulesRes, trainersRes] = await Promise.all([
        api.get("/schedules"),
        api.get("/gymadmin/trainers"),
      ]);

      setSchedules(schedulesRes.data || []);
      setTrainers(trainersRes.data?.items || []);
    } catch (err) {
      console.error("Failed to load schedules", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await api.delete(`/schedules/${id}`);
      load();
    } catch {
      alert("Failed to delete schedule");
    }
  };

  const trainerName = (id) =>
    trainers.find(t => t.id === id)?.email || `Trainer #${id}`;

  if (loading) return <p>Loading schedules…</p>;

  return (
    <div className="schedules-page">
      <div className="page-header">
        <h1>Training Schedules</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/gymadmin/schedules/new")}
        >
          + New Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <p>No schedules found</p>
      ) : (
        <div className="schedules-list">
          {schedules.map(s => (
            <div key={s.id} className="schedule-card">
              <strong>
                {new Date(s.workout_date).toDateString()}
              </strong>

              <p>
                {s.start_time} – {s.end_time}
              </p>

              <p>
                Trainer: {trainerName(s.trainer_id)}
              </p>

              <p>Status: {s.status}</p>

              {s.notes && <p>Notes: {s.notes}</p>}

              <div className="schedule-actions">
                <button
                  onClick={() =>
                    navigate(`/gymadmin/schedules/${s.id}/edit`)
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSchedule(s.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
