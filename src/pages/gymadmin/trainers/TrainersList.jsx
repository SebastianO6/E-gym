import React, { useEffect, useState } from "react";
import {
  listTrainers,
  inviteTrainer,
  updateTrainer,
  resendInvite,
  deleteTrainer
} from "../../../services/gymAdminService";

import TrainerForm from "./TrainerForm";
import styles from "./TrainersList.module.css";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../context/AlertContext";

export default function TrainersList() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { confirm } = useAlert();

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
    if (!(await confirm("Delete trainer permanently?", { title: "Delete Trainer", confirmLabel: "Delete", type: "danger" }))) return;

    await deleteTrainer(id);
    load();
  };

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Trainers</h1>

        <button
          className={styles.inviteBtn}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Invite Trainer
        </button>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th className={styles.actionsCol}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {trainers.map((t) => {
            const fullName = `${t.first_name || ""} ${t.last_name || ""}`.trim();

            return (
              <tr key={t.id}>
                <td
                  className={styles.nameCell}
                  onClick={() => navigate(`/gymadmin/trainers/${t.id}`)}
                >
                  {fullName || "—"}
                </td>

                <td>{t.email}</td>

                <td className={styles.actions}>
                  {t.invite_status === "pending" && !t.deleted_at && (
                    <button
                      className={styles.resendBtn}
                      onClick={() => resendInvite(t.id)}
                    >
                      Resend
                    </button>
                  )}

                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditing(t);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => remove(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
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
