import { useState } from "react";
import { renewGymSubscription } from "../../services/superadminService";
import styles from "./RenewGymModal.module.css";

const RenewGymModal = ({ gymId, onClose, onSuccess }) => {
  const [plan, setPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const renew = async () => {
    try {
      setLoading(true);

      await renewGymSubscription(gymId, plan);

      onSuccess();
      onClose();
    } catch (err) {
      alert("Renew failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Renew Gym Subscription</h2>

        <label>Plan</label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={renew} disabled={loading}>
            {loading ? "Renewing..." : "Renew"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewGymModal;
