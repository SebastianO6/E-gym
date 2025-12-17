import React, { useEffect, useState } from "react";
// import { getMyPlan } from "../../../services/clientService"; // Mocking for now as file structure is unknown
import styles from "./ClientPlan.module.css";
import { FileText } from "lucide-react";

// Mock data to ensure UI renders
const MOCK_PLANS = [
  {
    id: 1,
    title: "Strength & Hypertrophy Phase 1",
    plan: `Monday: Chest & Triceps
- Bench Press: 4 sets x 8-10 reps
- Incline Dumbbell Press: 3 sets x 10-12 reps
- Tricep Pushdowns: 3 sets x 15 reps

Wednesday: Back & Biceps
- Lat Pulldowns: 4 sets x 10 reps
- Barbell Rows: 3 sets x 8 reps
- Hammer Curls: 3 sets x 12 reps

Friday: Legs & Shoulders
- Squats: 4 sets x 6-8 reps
- Overhead Press: 3 sets x 8-10 reps
- Lunges: 3 sets x 12 reps per leg`,
    notes: "Focus on form and controlled movements. Increase weight only when you can complete all reps with good form."
  }
];

export default function ClientPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPlans(MOCK_PLANS);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div style={{padding: 24, textAlign: 'center'}}>Loading training plan...</div>;
  
  if (!plans.length) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3>No Plan Assigned</h3>
          <p>Your trainer hasn't assigned a workout plan yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Training Plan</h1>
      </div>
      
      {plans.map((p) => (
        <div key={p.id} className={styles.planCard}>
          <h3 className={styles.planTitle}>
            <FileText size={20} style={{display:'inline', marginRight: 8, verticalAlign:'text-bottom'}}/>
            {p.title || "Workout Plan"}
          </h3>
          <div className={styles.planContent}>{p.plan}</div>
          {p.notes && (
            <div className={styles.notes}>
              <strong>Trainer Notes:</strong> {p.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}