import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MemberDetails.module.css";
import RenewModal from "./RenewModal";
import EditMemberModal from "./EditMemberModal";

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
      <h1 className={styles.title}>{m.name}</h1>

      <p><strong>Phone:</strong> {m.phone}</p>
      <p><strong>Plan:</strong> {m.plan}</p>
      <p><strong>Expires:</strong> {m.expires}</p>

      <div className={styles.actions}>
        <button onClick={() => setShowEdit(true)}>Edit</button>
        <button onClick={() => setShowRenew(true)} className={styles.renewBtn}>
          Renew Subscription
        </button>
      </div>

      <div className={styles.card}>
        <h2>Attendance History</h2>
        <ul>
          {m.attendance.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      {showRenew && <RenewModal onClose={() => setShowRenew(false)} />}
      {showEdit && <EditMemberModal onClose={() => setShowEdit(false)} />}
    </div>
  );
};

export default MemberDetails;
