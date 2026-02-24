import { useEffect, useState } from "react";
import { listTrainers, assignTrainerToMember } from "../../../services/gymAdminService";
import styles from "./AssignTrainerModal.module.css";

export default function AssignTrainerModal({ memberId, onClose, onDone }) {
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await listTrainers();

      const accepted = all.filter(
        (t) => t.role === "trainer" && t.is_active && !t.invite_token
      );

      setTrainers(accepted);
    }
    load();
  }, []);

  const save = async () => {
    if (!trainerId) return alert("Select a trainer");
    setLoading(true);
    try {
      await assignTrainerToMember(memberId, trainerId);
      onDone?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <h3>Assign Trainer</h3>

      <select value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
        <option value="">Select trainer</option>
          {trainers
            .filter(t => t.first_name && t.last_name)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.first_name} {t.last_name}
              </option>
          ))}
      </select>

      <div className={styles.actions}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={save} disabled={loading}>
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  );
}
