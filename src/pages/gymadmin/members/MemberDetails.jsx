import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MemberDetails.module.css";
import RenewModal from "./RenewModal.jsx";
import EditMemberModal from "./EditMemberModal.jsx";
import { Edit2, CreditCard } from "lucide-react";

const MOCK_MEMBER = {
  id: 1,
  name: "Samuel Karanja",
  phone: "0712 345 678",
  plan: "Monthly",
  expires: "2025-03-12",
  status: "active",
  attendance: [ "2025-01-28", "2025-01-27", "2025-01-26" ]
};

const MemberDetails = () => {
  const { memberId } = useParams();

  const [showRenew, setShowRenew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const m = MOCK_MEMBER;

  return (
    <div className={styles.container}>
      {/* Header Info */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1>
            {m.name}
            <span className={`${styles.statusBadge} ${styles[m.status.toLowerCase()]}`}>
              {m.status}
            </span>
          </h1>
          <div className={styles.detailsMeta}>
            <span>Plan: {m.plan}</span>
            <span>•</span>
            <span>Expires: {m.expires}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setShowEdit(true)}>
            <Edit2 size={16} /> Edit
          </button>
          <button className={`${styles.btn} ${styles.btnRenew}`} onClick={() => setShowRenew(true)}>
            <CreditCard size={16} /> Renew Subscription
          </button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Personal Details */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Personal Details</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone Number</span>
            <span className={styles.value}>{m.phone}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Member ID</span>
            <span className={styles.value}>#{m.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Current Plan</span>
            <span className={styles.value}>{m.plan}</span>
          </div>
        </div>

        {/* Attendance */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Attendance</h2>
          <ul className={styles.historyList}>
            {m.attendance.map((d, i) => (
              <li key={i} className={styles.historyItem}>
                <span>Check-in</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showRenew && <RenewModal onClose={() => setShowRenew(false)} />}
      {showEdit && <EditMemberModal onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default MemberDetails;