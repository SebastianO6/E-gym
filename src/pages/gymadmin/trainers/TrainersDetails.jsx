import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainer, deleteTrainer } from "../../../services/gymAdminService";

export default function TrainerDetails() {
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState(null);

  useEffect(() => {
    getTrainer(trainerId).then(setTrainer);
  }, [trainerId]);

  if (!trainer) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Trainer</h1>
      <p><strong>Email:</strong> {trainer.email}</p>
      <p><strong>Bio:</strong> {trainer.bio || "—"}</p>

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
