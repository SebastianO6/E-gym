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
        (t) => t.role === "trainer"
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
      await load();
      alert("Trainer assigned successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to assign trainer");
    }
  };

  if (loading) return <p>Loading member…</p>;
  if (!member) return <p>Member not found</p>;

  const fullName =
    `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
    "Not provided";

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Member Profile</h2>

      {/* MEMBER INFO */}
      <div className={styles.infoGrid}>
        <div className={styles.card}>
          <h3>Member Information</h3>

          <div className={styles.infoRow}>
            <span>Name</span>
            <strong>{fullName}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Email</span>
            <strong>{member.email}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Phone</span>
            <strong>{member.phone || "Not provided"}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Status</span>
            <strong className={styles.status}>{member.status}</strong>
          </div>

          <div className={styles.infoRow}>
            <span>Plan</span>
            <strong>{member.subscription?.plan || "—"}</strong>
          </div>

          <button
            className={styles.primaryBtn}
            onClick={() => setShowRenew(true)}
          >
            Renew Membership
          </button>
        </div>

        {/* TRAINER ASSIGNMENT */}
        <div className={styles.card}>
          <h3>Assign Trainer</h3>

          <select
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
          >
            <option value="">Select trainer</option>

            {trainers.map((t) => {
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
            Assign Trainer
          </button>
        </div>
      </div>

      {/* PAYMENTS */}
      <div className={styles.paymentSection}>
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
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>KES {p.amount}</td>
                  <td>{p.method}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


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