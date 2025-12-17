import React from "react";
import styles from "./TrainerSchedule.module.css";
import { Clock } from "lucide-react";

// MOCK schedule
const MOCK = [
  { id:1, day: "Monday", time: "09:00 AM", member: "Alex Johnson", type: "1-on-1 Training" },
  { id:2, day: "Monday", time: "11:00 AM", member: "Maria Gomez", type: "Consultation" },
  { id:3, day: "Tuesday", time: "02:00 PM", member: "David Lee", type: "HIIT Session" },
  { id:4, day: "Wednesday", time: "10:00 AM", member: "Sarah Connor", type: "Strength Training" },
];

export default function TrainerSchedule(){
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Weekly Schedule</h1>
        <p className={styles.subtitle}>Upcoming sessions for this week.</p>
      </div>

      <div className={styles.list}>
        {MOCK.map(s => (
          <div key={s.id} className={styles.scheduleCard}>
            <div className={styles.timeCol}>
              <span className={styles.day}>{s.day}</span>
              <span className={styles.time}>{s.time}</span>
            </div>
            <div className={styles.infoCol}>
              <div className={styles.member}>{s.member}</div>
              <div className={styles.type}>{s.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}