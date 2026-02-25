import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainer, deleteTrainer } from "../../../services/gymAdminService";
import TrainerCalendar from "./TrainersCalendar";

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

  if (!trainer) return <p>Loading...</p>;

  const clients = trainer.clients || [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Trainer</h1>

      <p><strong>Email:</strong> {trainer.email}</p>
      <p><strong>Bio:</strong> {trainer.bio || "—"}</p>

      <TrainerCalendar trainerId={trainer.id} />

      <hr />

      <h3>Assigned Members</h3>

      {clients.length === 0 ? (
        <p>No members assigned</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>{client.email}</li>
          ))}
        </ul>
      )}

      <button
        style={{ marginTop: "1rem", color: "red" }}
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
  );
}