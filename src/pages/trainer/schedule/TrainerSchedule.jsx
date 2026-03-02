import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { updateSchedule } from "../../../services/trainerServiceSchedule";
import styles from "./TrainerSchedule.module.css";

const TrainerSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/schedules/trainer");
      setSessions(res.data || []);
    } catch (err) {
      console.error(err);
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
    <div className={styles['trainer-schedule']}>
      <h2 className={styles['trainer-schedule-title']}>My Schedule</h2>

      {sessions.length === 0 ? (
        <div className={styles['empty-state']}>No sessions assigned yet.</div>
      ) : (
        <div className={styles['trainer-table-wrapper']}>
          <table className={styles['trainer-table']}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/trainer/schedule/${s.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{new Date(s.start_time).toLocaleDateString()}</td>
                  <td>
                    <strong>{s.member_name}</strong>
                    <div style={{ fontSize: 13, color: "#777" }}>
                      {s.plan_title}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles['status-badge']} ${styles[`status-${s.status}`]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {s.status === "scheduled" && (
                      <button
                        className={styles['trainer-btn'] + ' ' + styles['btn-complete']}
                        onClick={() => markCompleted(s.id)}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      className={styles['trainer-btn'] + ' ' + styles['btn-delete']}
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
};

export default TrainerSchedule;