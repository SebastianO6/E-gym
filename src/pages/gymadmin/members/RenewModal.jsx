import { useState } from "react";
import api from "../../../api/axios";
import styles from "./RenewModal.module.css";
import { X } from "lucide-react";

const RenewModal = ({ memberId, onClose, onSuccess }) => {
  const [plan, setPlan] = useState("daily");
  const [loading, setLoading] = useState(false);

  const renew = async () => {
    try {
      setLoading(true);
      await api.post(`/gymadmin/members/${memberId}/renew`, {
        plan
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Renew failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Renew Subscription</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className={styles.body}>
          <label>Plan</label>
          <select value={plan} onChange={e => setPlan(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={renew} disabled={loading}>
            {loading ? "Renewing..." : "Renew"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewModal;
