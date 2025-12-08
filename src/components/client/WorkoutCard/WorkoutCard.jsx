import React from "react";
import styles from "./WorkoutCard.module.css";

const WorkoutCard = ({ workout }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{workout.title}</h3>
      <p className={styles.duration}>{workout.duration}</p>

      <ul className={styles.list}>
        {workout.exercises.map((ex, index) => (
          <li key={index} className={styles.item}>{ex}</li>
        ))}
      </ul>

      <button className={styles.startBtn}>Start Workout</button>
    </div>
  );
};

export default WorkoutCard;
