import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  activateTrainer,
  deactivateTrainer,
  deleteMember,
  getTrainer,
  listTrainers,
  updateMember,
} from "../../../services/gymAdminService";
import { useAlert } from "../../../context/AlertContext";
import TrainerCalendar from "./TrainersCalendar";
import styles from "./TrainersDetails.module.css";

export default function TrainerDetails() {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const { confirm } = useAlert();

  const [trainer, setTrainer] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [savingMemberId, setSavingMemberId] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState({});

  const loadTrainer = useCallback(async () => {
    try {
      const [trainerData, trainerList] = await Promise.all([
        getTrainer(trainerId),
        listTrainers(),
      ]);

      setTrainer(trainerData);
      setAllTrainers(trainerList || []);
      setSelectedAssignments(
        Object.fromEntries(
          (trainerData.clients || []).map((client) => [client.id, String(client.trainer_id || "")])
        )
      );
    } catch (err) {
      console.error("Failed to fetch trainer", err);
    }
  }, [trainerId]);

  useEffect(() => {
    loadTrainer();
  }, [loadTrainer]);

  const availableTrainers = useMemo(
    () => (allTrainers || []).filter((item) => item.id !== Number(trainerId)),
    [allTrainers, trainerId]
  );

  const handleToggleStatus = async () => {
    if (!trainer) return;

    const isActive = trainer.status === "active";
    const approved = await confirm(
      isActive ? "Deactivate this trainer?" : "Activate this trainer?",
      {
        title: isActive ? "Deactivate Trainer" : "Activate Trainer",
        confirmLabel: isActive ? "Deactivate" : "Activate",
        type: isActive ? "danger" : "info",
      }
    );
    if (!approved) return;

    try {
      setStatusLoading(true);
      if (isActive) {
        await deactivateTrainer(trainer.id);
      } else {
        await activateTrainer(trainer.id);
      }
      await loadTrainer();
    } finally {
      setStatusLoading(false);
    }
  };

  const handleReassign = async (memberId) => {
    const nextTrainerId = selectedAssignments[memberId];
    if (!nextTrainerId || Number(nextTrainerId) === Number(trainerId)) return;

    try {
      setSavingMemberId(memberId);
      await updateMember(memberId, { trainer_id: Number(nextTrainerId) });
      await loadTrainer();
      window.alert("Member reassigned successfully.");
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to reassign member.");
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleRemoveFromTrainer = async (memberId) => {
    const approved = await confirm(
      "Remove this member from the trainer? The member record will stay in the gym.",
      {
        title: "Remove Assignment",
        confirmLabel: "Remove",
        type: "danger",
      }
    );
    if (!approved) return;

    try {
      setSavingMemberId(memberId);
      await updateMember(memberId, { trainer_id: null });
      await loadTrainer();
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to remove trainer assignment.");
    } finally {
      setSavingMemberId(null);
    }
  };

  const handleDeleteMember = async (memberId) => {
    const approved = await confirm(
      "Delete this member permanently from the gym?",
      {
        title: "Delete Member",
        confirmLabel: "Delete",
        type: "danger",
      }
    );
    if (!approved) return;

    try {
      setSavingMemberId(memberId);
      await deleteMember(memberId);
      await loadTrainer();
    } catch (err) {
      window.alert(err.response?.data?.error || "Failed to delete member.");
    } finally {
      setSavingMemberId(null);
    }
  };

  if (!trainer) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.hero}>
          <div>
            <div className={styles.badge}>{trainer.status === "active" ? "Active Trainer" : "Inactive Trainer"}</div>
            <div className={styles.header}>
              <h1>{trainer.full_name || "Trainer"}</h1>
              <p>{trainer.email}</p>
            </div>
            <div className={styles.meta}>
              <span>Phone: {trainer.phone || "No phone"}</span>
              <span>Assigned Members: {trainer.clients?.length || 0}</span>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button
              className={trainer.status === "active" ? styles.deactivateBtn : styles.activateBtn}
              onClick={handleToggleStatus}
              disabled={statusLoading}
            >
              {statusLoading ? "Saving..." : trainer.status === "active" ? "Deactivate Trainer" : "Activate Trainer"}
            </button>
            <button className={styles.secondaryBtn} onClick={() => navigate("/gymadmin/trainers")}>
              Back to Trainers
            </button>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.membersCard}>
          <div className={styles.sectionHeader}>
            <h2>Assigned Members</h2>
            <p>Reassign or remove members without leaving this page.</p>
          </div>

          {!trainer.clients?.length ? (
            <p className={styles.empty}>No members assigned to this trainer yet.</p>
          ) : (
            <div className={styles.memberList}>
              {trainer.clients.map((client) => (
                <div key={client.id} className={styles.memberRow}>
                  <div className={styles.memberInfo}>
                    <strong>{client.full_name || client.email}</strong>
                    <span>{client.email}</span>
                    <span>{client.phone || "No phone provided"}</span>
                  </div>

                  <div className={styles.memberActions}>
                    <select
                      value={selectedAssignments[client.id] || ""}
                      onChange={(e) =>
                        setSelectedAssignments((prev) => ({
                          ...prev,
                          [client.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select trainer</option>
                      {availableTrainers.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.full_name || item.email}
                        </option>
                      ))}
                    </select>

                    <button
                      className={styles.assignBtn}
                      onClick={() => handleReassign(client.id)}
                      disabled={!selectedAssignments[client.id] || savingMemberId === client.id}
                    >
                      {savingMemberId === client.id ? "Saving..." : "Reassign"}
                    </button>

                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveFromTrainer(client.id)}
                      disabled={savingMemberId === client.id}
                    >
                      Remove
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteMember(client.id)}
                      disabled={savingMemberId === client.id}
                    >
                      Delete Member
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.calendarCard}>
          <div className={styles.sectionHeader}>
            <h2>Trainer Schedule</h2>
            <p>Upcoming sessions only.</p>
          </div>
          <TrainerCalendar trainerId={trainer.id} />
        </div>
      </div>
    </div>
  );
}
