import React from "react";
import styles from "./ClientPlan.module.css";

// mock assigned plan (later API)
const mockPlan = {
  trainer: "John Trainer",
  week: "Week 1",
  days: [
    {
      day: "Monday",
      exercises: [
        { name: "Squats", sets: 4, reps: 12 },
        { name: "Bench Press", sets: 4, reps: 8 },
        { name: "Planks", duration: "60 sec" },
      ],
    },
    {
      day: "Wednesday",
      exercises: [
        { name: "Deadlifts", sets: 3, reps: 5 },
        { name: "Pull Ups", sets: 3, reps: 10 },
      ],
    },
  ],
};

const ClientPlan = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Training Plan</h1>
      <p className={styles.trainer}>Assigned by: {mockPlan.trainer}</p>

      {mockPlan.days.map((day, i) => (
        <div key={i} className={styles.dayCard}>
          <h2 className={styles.dayTitle}>{day.day}</h2>

          {day.exercises.map((ex, idx) => (
            <div key={idx} className={styles.exercise}>
              <p className={styles.exerciseName}>{ex.name}</p>
              {ex.sets && <p>{ex.sets} sets × {ex.reps} reps</p>}
              {ex.duration && <p>{ex.duration}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClientPlan;
