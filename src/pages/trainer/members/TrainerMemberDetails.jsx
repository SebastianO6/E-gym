import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import styles from "./TrainerMemberDetails.module.css";
import { ArrowLeft, Mail, Phone, FilePlus, MessageCircle } from "lucide-react";

const TrainerMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    api.get(`/trainer/members/${memberId}`).then(res => {
      setMember(res.data);
    });
  }, [memberId]);

  if (!member) return <p>Loading member…</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className={styles.headerCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>
            {member.full_name.charAt(0)}
          </div>

          <div>
            <h1>{member.full_name}</h1>
            <div className={styles.tags}>
              <span>{member.goal}</span>
              <span>{member.age} years</span>
              <span
                className={
                  member.subscription_status === "Active"
                    ? styles.activeBadge
                    : styles.inactiveBadge
                }
              >
                {member.subscription_status === "Active"
                  ? `🟢 ${member.active_plan}`
                  : "🔴 No Active Plan"}
              </span>

            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => navigate("/trainer/messages")}>
            <MessageCircle size={16} /> Message
          </button>

          <button onClick={() => navigate(`/trainer/plans/create?member=${member.id}`)}>
            <FilePlus size={16} /> Create Plan
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Contact</h3>
          <p><Mail size={14}/> {member.email}</p>
          <p><Phone size={14}/> {member.phone || "—"}</p>
        </div>

        <div className={styles.card}>
          <h3>Trainer Notes</h3>
          <p>{member.notes || "No notes yet"}</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerMemberDetails;
