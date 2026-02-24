import { useEffect, useState } from "react";
import {
  updateSchedule,
  createSchedule
} from "../../../services/trainerServiceSchedule";
import api from "../../../api/axios";
import "./TrainerSchedule.module.css";
import { useNavigate } from "react-router-dom";


const TrainerSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);

  const [form, setForm] = useState({
    client_id: "",
    plan_id: "",
    workout_date: "",
    start_time: "",
    end_time: ""
  });

  const load = async () => {
    try {
      const res = await api.get("/schedules/trainer");
      setSessions(res.data || []);
    } catch (err) {
      console.error(err);
      setSessions([]);
    }
  };



  const loadClients = async () => {
    const res = await api.get("/trainer/members");
    setClients(res.data.items || []);
  };

  const loadPlans = async () => {
    const res = await api.get("/trainer/workout-plans");
    setPlans(res.data.items || []);
  };

  useEffect(() => {
    load();
    loadClients();
    loadPlans();
  }, []);

  const markCompleted = async (id) => {
    await updateSchedule(id, { status: "completed" });
    load();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createSchedule(form);

    setForm({
      client_id: "",
      plan_id: "",
      workout_date: "",
      start_time: "",
      end_time: ""
    });

    load();
  };

  const navigate = useNavigate();


    const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;

    try {
      await api.delete(`/schedules/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete schedule");
    }
  };


  return (
    <div className="trainer-schedule">
      <h2 className="trainer-schedule-title">My Schedule</h2>

      {sessions.length === 0 ? (
        <div className="empty-state">No sessions assigned yet.</div>
      ) : (
        <div className="trainer-table-wrapper">
          <table className="trainer-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {sessions.map(s => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/trainer/schedule/${s.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* DATE */}
                  <td>
                    {new Date(s.start_time).toLocaleDateString()}
                  </td>

                  {/* CLIENT + PLAN */}
                  <td>
                    <strong>{s.member_name}</strong>
                    <div style={{ fontSize: 13, color: "#777" }}>
                      {s.plan_title}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`status-badge status-${s.status}`}>
                      {s.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td onClick={e => e.stopPropagation()}>
                    {s.status === "scheduled" && (
                      <button
                        className="trainer-btn btn-complete"
                        onClick={() => markCompleted(s.id)}
                      >
                        Complete
                      </button>
                    )}

                    <button
                      className="trainer-btn btn-delete"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default TrainerSchedule;
