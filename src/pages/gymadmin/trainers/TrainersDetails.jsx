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

  if(!trainer) return <p style={{padding:20}}>Trainer not found</p>;

  return (
    <div className={styles.container}>
      <h1>{trainer.name}</h1>
      <p>{trainer.email} • {trainer.phone}</p>
      <p><strong>Assigned Members:</strong> {trainer.assignedMembers}</p>
      <div className={styles.card}><h3>Bio</h3><p>{trainer.bio}</p></div>
    </div>
  );
}
