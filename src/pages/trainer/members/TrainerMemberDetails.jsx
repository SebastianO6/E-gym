import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TrainerMemberDetails.module.css";
import { Mail, Phone, ArrowLeft, FilePlus, MessageCircle } from "lucide-react";

// MOCK
const MOCK = {
  1: { id:1, name:"Alex Johnson", age:28, goal:"Weight Loss", email:"alex@example.com", phone:"+1 555 111", notes:"Knee issues. Low impact exercises preferred." , activePlan: null },
  2: { id:2, name:"Maria Gomez", age:31, goal:"Muscle Gain", email:"maria@example.com", phone:"+1 555 222", notes:"Morning sessions preferred.", activePlan:"Hypertrophy 1"}
};

const TrainerMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    setMember(MOCK[memberId] || null);
  }, [memberId]);

  if (!member) return <div style={{padding: 40, textAlign: 'center'}}>Loading member...</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header Profile */}
      <div className={styles.headerCard}>
        <div className={styles.profileInfo}>
            <div className={styles.avatar}>{member.name.charAt(0)}</div>
            <div className={styles.nameCol}>
                <h1>{member.name}</h1>
                <div className={styles.badges}>
                    <span className={styles.tag}>{member.goal}</span>
                    <span className={styles.tag}>{member.age} years old</span>
                    {member.activePlan && <span className={styles.planTag}>Active: {member.activePlan}</span>}
                </div>
            </div>
        </div>

        <div className={styles.actions}>
            <button onClick={() => navigate(`/trainer/messages`)} className={`${styles.btn} ${styles.secondary}`}>
                <MessageCircle size={18} /> Message
            </button>
            <button onClick={() => navigate(`/trainer/plans/create?member=${member.id}`)} className={`${styles.btn} ${styles.primary}`}>
                <FilePlus size={18} /> Create Plan
            </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
            <h3>Contact Information</h3>
            <div className={styles.row}>
                <span className={styles.label}><Mail size={14} style={{display:'inline', marginRight:6}}/> Email</span>
                <span className={styles.value}>{member.email}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}><Phone size={14} style={{display:'inline', marginRight:6}}/> Phone</span>
                <span className={styles.value}>{member.phone}</span>
            </div>
        </div>

        <div className={styles.card}>
            <h3>Trainer Notes</h3>
            <div className={styles.notes}>
                {member.notes}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerMemberDetails;