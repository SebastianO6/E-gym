import React, { useEffect, useState } from "react";
import styles from "./PricingSettings.module.css";
import {
  getGymPricing,
  setGymPricing
} from "../../../services/gymAdminService";

export default function PricingSettings() {
  const [daily, setDaily] = useState("");
  const [monthly, setMonthly] = useState("");
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getGymPricing()
      .then((data) => {
        if (!data) {
          setDaily("");
          setMonthly("");
          setApproved(false);
        } else {
          setDaily(data.daily_price ?? "");
          setMonthly(data.monthly_price ?? "");
          setApproved(Boolean(data.approved));
        }
      })
      .catch(() => {
        setDaily("");
        setMonthly("");
        setApproved(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await setGymPricing({
      daily_price: daily,
      monthly_price: monthly
    });
    setApproved(false);
    setSaving(false);
    alert("Pricing submitted for approval");
  };

  if (loading) return <p>Loading pricing...</p>;

  return (
    <div className={styles.card}>
      <h2>💰 Pricing Settings</h2>

      <div className={styles.field}>
        <label>Daily Price (KES)</label>
        <input
          type="number"
          value={daily}
          onChange={(e) => setDaily(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Monthly Price (KES)</label>
        <input
          type="number"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
      </div>

      <button
        className={styles.save}
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Pricing"}
      </button>

      {!approved && (
        <p className={styles.pending}>
          ⏳ Awaiting superadmin approval
        </p>
      )}

      {approved && (
        <p className={styles.approved}>
          ✅ Pricing approved
        </p>
      )}
    </div>
  );
}
