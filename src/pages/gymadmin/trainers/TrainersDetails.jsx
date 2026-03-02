import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainer, deleteTrainer } from "../../../services/gymAdminService";
import TrainerCalendar from "./TrainersCalendar";
import styles from "./TrainersDetails.module.css";

export default function TrainerDetails() {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const data = await getTrainer(trainerId);
        setTrainer(data);
      } catch (err) {
        console.error("Failed to fetch trainer", err);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  if (!trainer) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>{trainer.full_name || "Trainer"}</h1>
          <p>{trainer.email}</p>
        </div>

        <div className={styles.meta}>
          <span>📞 {trainer.phone || "No phone"}</span>
          <span>👥 {trainer.clients?.length || 0} Members</span>
        </div>

        <button
          className={styles.deleteBtn}
          onClick={async () => {
            if (window.confirm("Delete trainer?")) {
              await deleteTrainer(trainer.id);
              window.history.back();
            }
          }}
        >
          Delete Trainer
        </button>
      </div>

      <div className={styles.calendarCard}>
        <TrainerCalendar trainerId={trainer.id} />
      </div>
    </div>
  );
}