import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import styles from "./TrainerMemberDetails.module.css";
import { ArrowLeft, Mail, Phone, FilePlus, MessageCircle, User } from "lucide-react";

const TrainerMemberDetails = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const memberRes = await api.get(`/trainer/members/${memberId}`);
      setMember(memberRes.data);

      const plansRes = await api.get(`/trainer/members/${memberId}/plans`);
      setPlans(plansRes.data.items || []);


    };
    loadData();
  }, [memberId]);

  if (!member) return <p>Loading member…</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className={styles.headerCard}>
        <div className={styles.leftSection}>
          <div className={styles.avatar}>
            <User size={26} />
          </div>
          <div className={styles.profileText}>
            <h1>{member.full_name}</h1>
            <p><strong>Phone:</strong> {member.phone || "—"}</p>
            <div className={styles.tags}>
              <span className={member.subscription_status === "Active" ? styles.activeBadge : styles.inactiveBadge}>
                {member.subscription_status === "Active" ? `Active • ${member.active_plan}` : "No Active Plan"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.statBox}>
            <h4>Total Plans</h4>
            <p>{plans.length}</p>
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
      </div>

      {/* Trainer Info & Notes */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Contact Information</h3>
          <p><Mail size={14} /> {member.email}</p>
          <p><Phone size={14} /> {member.phone || "—"}</p>
        </div>

        <div className={styles.card}>
          <h3>Assigned Trainer</h3>
          <p><strong>{member.trainer?.full_name}</strong></p>
          <p><Mail size={14} /> {member.trainer?.email}</p>
          <p><Phone size={14} /> {member.trainer?.phone || "—"}</p>
        </div>

      </div>
    </div>
  );
};

export default TrainerMemberDetails;