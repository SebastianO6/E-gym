import React, { useEffect, useState } from "react";
import styles from "./ClientPlan.module.css";
import api from "../../../api/axios";

export default function ClientPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get("/client/plans")
      .then(res => setPlans(res.data || []))
      .catch(() => setPlans([]));
  }, []);

  if (!plans.length)
    return <p style={{ padding: 24 }}>No Plan Assigned</p>;

  const plan = plans[0];

  return (
    <div className={styles.container}>
      <h1>{plan.trainer_name} {plan.title}</h1>

      <p><strong>Client:</strong> Scheduled</p>

      {plan.days?.map((day) => (
        <div key={day.day_name} className={styles.dayBlock}>
          <h2>{day.day_name}</h2>

          {day.exercises.map((ex, i) => (
            <div key={i} className={styles.exerciseBlock}>
              <h3>{ex.name}</h3>
              <p>
                {ex.sets} sets × {ex.reps} reps • Rest {ex.rest}s
              </p>
            </div>
          ))}
        </div>
      ))}

      {plan.description && (
        <div className={styles.notes}>
          <h3>Trainer Notes</h3>
          <p>{plan.description}</p>
        </div>
      )}
    </div>
  );
}