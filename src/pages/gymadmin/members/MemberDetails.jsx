import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getMember,
  listTrainers,
  assignTrainerToMember,
  getMemberPayments,
} from "../../../services/gymAdminService";
import styles from "./MemberDetails.module.css";
import RenewModal from "./RenewModal";
import PaymentHistory from "./PaymentHistory";

export default function MemberDetails() {
  const { memberId } = useParams();

  const [member, setMember] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [payments, setPayments] = useState([]);
  const [showRenew, setShowRenew] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [memberData, trainersData, paymentsData] =
        await Promise.all([
          getMember(memberId),
          listTrainers(),
          getMemberPayments(memberId),
        ]);

      setMember(memberData);

      const validTrainers = (trainersData || []).filter(
        t => t.role === "trainer"
      );



      setTrainers(validTrainers);
      setTrainerId(memberData?.trainer_id || "");
      setPayments(paymentsData || []);
    } catch (err) {
      console.error("Failed to load member details", err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    load();
  }, [load]);

  const assignTrainer = async () => {
    if (!trainerId || isNaN(trainerId)) {
      alert("Please select a trainer");
      return;
    }

    try {
      await assignTrainerToMember(memberId, Number(trainerId));
      await load()
      alert("Trainer assigned successfully");
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to assign trainer");
    }
  };

  if (loading) return <p>Loading member…</p>;
  if (!member) return <p>Member not found</p>;

  return (
    <div className={styles.container}>
      <h2>Member Details</h2>

      {/* MEMBER INFO */}
      <div className={styles.card}>
        <p><b>Email:</b> {member.email}</p>
        <p><b>Status:</b> {member.status}</p>
        <p><b>Plan:</b> {member.subscription?.plan || "—"}</p>

        <button
          className={styles.primaryBtn}
          onClick={() => setShowRenew(true)}
        >
          Renew Membership
        </button>
      </div>

      <hr />

      {/* ASSIGN TRAINER */}
      <div className={styles.card}>
        <h3>Assign Trainer</h3>

        <select
          value={trainerId}
          onChange={e => setTrainerId(e.target.value)}
        >
          <option value="">Select trainer</option>
          {trainers.map(t => {
            const label =
              `${t.first_name || ""} ${t.last_name || ""}`.trim() ||
              t.email ||
              `Trainer #${t.id}`;

            return (
              <option key={t.id} value={t.id}>
                {label}
              </option>
            );
          })}

        </select>

        <button
          onClick={assignTrainer}
          className={styles.secondaryBtn}
        >
          Assign
        </button>
      </div>

      <hr />

      {/* PAYMENTS */}
      <h3>Payment History</h3>

      {payments.length === 0 ? (
        <p>No payments yet</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>{p.amount}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PaymentHistory memberId={member.id} />

      {showRenew && (
        <RenewModal
          memberId={member.id}
          onClose={() => setShowRenew(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
