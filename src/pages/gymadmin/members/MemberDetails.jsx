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
import { deleteMember } from "../../../services/gymAdminService";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../../../components/confirmDeleteModal";

export default function MemberDetails() {
  const { memberId } = useParams();

  const [member, setMember] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [payments, setPayments] = useState([]);
  const [showRenew, setShowRenew] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deleteMember(member.id);

      alert("Member deleted successfully");

      navigate("/gymadmin/members");
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

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

      <button
        className={styles.deleteBtn}
        onClick={() => setShowDelete(true)}
      >
        Permanently Delete Member
      </button>

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

      {showDelete && (
        <ConfirmDeleteModal
          title="Delete Member"
          message="This action is permanent. The member, subscriptions and payments will be permanently removed."
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}