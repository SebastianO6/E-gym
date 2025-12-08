import React from "react";
import styles from "./TrainerSchedule.module.css";

// MOCK schedule
const MOCK = [
  { id:1, day: "Monday", time: "09:00", member: "Alex Johnson" },
  { id:2, day: "Monday", time: "11:00", member: "Maria Gomez" },
  { id:3, day: "Tuesday", time: "14:00", member: "David Lee" },
];

export default function TrainerSchedule(){
  return (
    <div className={styles.container}>
      <h1>Schedule</h1>
      <p className={styles.subtitle}>Weekly schedule — simple view. (Replace with calendar later)</p>

      <div className={styles.list}>
        {MOCK.map(s => (
          <div key={s.id} className={styles.item}>
            <div>
              <div className={styles.day}>{s.day}</div>
              <div className={styles.time}>{s.time}</div>
            </div>
            <div className={styles.member}>{s.member}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
