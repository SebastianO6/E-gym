import React, { useEffect, useState } from "react";
import { listTrainers, assignTrainer } from "../../../services/gymAdminService";

export default function AssignTrainerModal({ member, onClose, onDone }) {
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState(member.trainer_id || "");

  useEffect(() => {
    listTrainers().then(res => setTrainers(res.data));
  }, []);

  const save = async () => {
    if (!trainerId) return alert("Select a trainer");
    await assignTrainer(member.id, trainerId);
    onDone?.();
    onClose();
  };

  return (
    <div>
      <h3>Assign Trainer</h3>
      <select value={trainerId} onChange={e => setTrainerId(e.target.value)}>
        <option value="">Select trainer</option>
        {trainers.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button onClick={save}>Assign</button>
    </div>
  );
}
