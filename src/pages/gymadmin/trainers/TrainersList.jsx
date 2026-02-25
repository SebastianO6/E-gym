import React, { useEffect, useState } from "react";
import {
  listTrainers,
  inviteTrainer,
  updateTrainer,
  deleteTrainer,
  resendInvite,
} from "../../../services/gymAdminService";
import TrainerForm from "./TrainerForm";
import styles from "./TrainersList.module.css";
import { useNavigate } from "react-router-dom";

export default function TrainersList() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await listTrainers();
    setTrainers(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (payload) => {
    await inviteTrainer(payload);
  };

  const update = async (id, payload) => {
    await updateTrainer(id, payload);
  };

  const remove = async (id) => {
    if (!window.confirm("Soft delete trainer?")) return;
    await deleteTrainer(id);
    load();
  };

  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header>
        <h1>Trainers</h1>
        <button onClick={() => setShowForm(true)}>Invite Trainer</button>
      </header>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {trainers.map((t) => (
            <tr key={t.id}>
              <td
                style={{ cursor: "pointer", fontWeight: "600", color: "#2563eb" }}
                onClick={() => navigate(`/gymadmin/trainers/${t.id}`)}
              >
                {t.first_name} {t.last_name}
              </td>
              <td>{t.email}</td>
              <td>
                {t.invite_status === "pending" && "Pending"}
                {t.invite_status === "accepted" && t.is_active && "Active"}
                {t.deleted_at && "Deleted"}
              </td>
              <td>
                {t.invite_status === "pending" && (
                  <button onClick={() => resendInvite(t.id)}>Resend</button>
                )}
                <button onClick={() => {
                  setEditing(t);
                  setShowForm(true);
                }}>
                  Edit
                </button>
                <button onClick={() => remove(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <TrainerForm
          existingTrainer={editing}
          onCreate={create}
          onUpdate={update}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
          onSuccess={() => {
            setEditing(null);
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}
