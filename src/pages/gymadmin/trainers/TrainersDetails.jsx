import React, { useEffect, useState } from "react";
import styles from "./TrainersDetails.module.css";
import { useParams } from "react-router-dom";

// MOCK
const MOCK = {
  1: { id:1, name:"Mike Johnson", email:"mike@test.com", phone:"+1 555", assignedMembers:12, bio:"Specializes in strength training." },
  2: { id:2, name:"Lisa Wong", email:"lisa@test.com", phone:"+1 556", assignedMembers:9, bio:"Focus on mobility & rehab." }
};

export default function TrainerDetails(){
  const { trainerId } = useParams();
  const [trainer, setTrainer] = useState(null);

  useEffect(()=>{ setTrainer(MOCK[trainerId] || null); },[trainerId]);

  if(!trainer) return <div style={{padding: 40, textAlign: 'center', color: '#666'}}>Trainer not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <h1 className={styles.name}>{trainer.name}</h1>
        <div className={styles.meta}>
          <span>{trainer.email}</span>
          <span>•</span>
          <span>{trainer.phone}</span>
        </div>
        <div className={styles.statsRow}>
          <p style={{ margin: 0 }}><strong>Assigned Members:</strong> {trainer.assignedMembers}</p>
        </div>
      </div>
      
      <div className={styles.bioCard}>
        <h3 className={styles.sectionTitle}>Bio</h3>
        <p className={styles.text}>{trainer.bio}</p>
      </div>
    </div>
  );
}