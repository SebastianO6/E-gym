import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TrainerMemberDetails.module.css";

// MOCK (replace with api.get(`/trainer/members/${id}`))
const MOCK = {
  1: { id:1, name:"Alex Johnson", age:28, goal:"Weight Loss", email:"alex@example.com", phone:"+1 555 111", notes:"Knee issues. Low impact." , activePlan: null },
  2: { id:2, name:"Maria Gomez", age:31, goal:"Muscle Gain", email:"maria@example.com", phone:"+1 555 222", notes:"Morning sessions preferred.", activePlan:"Hypertrophy 1"}
};

const TrainerMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    // TODO: replace with API call
    setMember(MOCK[memberId] || null);
  }, [memberId]);

  if (!member) return <p style={{padding:24}}>Member not found</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{member.name}</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>Goal: {member.goal}</span>
          {member.activePlan ? <span className={styles.planTag}>Plan: {member.activePlan}</span> : null}
        </div>
      </div>

      <div className={styles.card}>
        <h3>Contact</h3>
        <p>{member.email || "—"}</p>
        <p>{member.phone || "—"}</p>
      </div>

      <div className={styles.card}>
        <h3>Notes</h3>
        <p>{member.notes}</p>
      </div>

      <div className={styles.actions}>
        <button onClick={() => navigate(`/trainer/plans/create?member=${member.id}`)} className={styles.primary}>Create Plan</button>
        <button onClick={() => navigate(`/trainer/messages/${member.id}`)} className={styles.secondary}>Message</button>
        <button onClick={() => navigate(-1)} className={styles.ghost}>Back</button>
      </div>
    </div>
  );
};

export default TrainerMemberDetails;
