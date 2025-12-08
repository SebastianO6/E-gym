import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GymDetails.module.css";

import EditGymModal from "./EditGymModal";
import ConfirmationModal from "../../components/common/confirmationModal/confirmationModal";

const MOCK_GYMS = {
  1: { id:1, name:"FitZone Downtown", status:"active", owner:{name:"John Doe", email:"john@example.com", phone:"+1 555 222 1111"}, members:245, revenue:24500, trainers:12, subscriptions:{ total:340, active:210, expired:130 }, address:"123 Main Street, Downtown" },
  2: { id:2, name:"PowerGym East", status:"pending", owner:{name:"Sarah Jones", email:"sarah@example.com", phone:"+1 555 000 3333"}, members:189, revenue:18900, trainers:9, subscriptions:{ total:300, active:160, expired:140 }, address:"89 East Avenue" },
};

const GymDetails = () => {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirm, setConfirm] = useState({ open:false, type:null });

  useEffect(() => {
    const data = MOCK_GYMS[gymId];
    setGym(data);
  }, [gymId]);

  if (!gym) return <p className={styles.loading}>Loading gym details...</p>;

  const handleSave = (updated) => {
    setGym(updated);
    // TODO: api.patch(`/superadmin/gyms/${gym.id}`, updated)
  };

  const handleTogglePrepare = () => {
    setConfirm({ open:true, type: gym.status === "active" ? "suspend" : "activate" });
  };

  const handleDeletePrepare = () => {
    setConfirm({ open:true, type: "delete" });
  };

  const handleConfirm = () => {
    if (confirm.type === "suspend") {
      setGym({ ...gym, status: "suspended" });
      // TODO: api.patch(...)
    } else if (confirm.type === "activate") {
      setGym({ ...gym, status: "active" });
    } else if (confirm.type === "delete") {
      // TODO: call API to delete, then redirect to AllGyms
      console.log("Delete gym:", gym.id);
      // for now simulate redirect by clearing:
      setGym(null);
    }
    setConfirm({ open:false, type:null });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.gymName}>{gym.name}</h1>
          <span className={`${styles.status} ${styles[gym.status]}`}>{gym.status}</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.editBtn} onClick={() => setShowEdit(true)}>Edit Gym</button>
          <button className={`${styles.statusBtn} ${gym.status === "active" ? styles.suspend : styles.activate}`} onClick={handleTogglePrepare}>
            {gym.status === "active" ? "Suspend Gym" : "Activate Gym"}
          </button>
          <button className={styles.deleteBtn} onClick={handleDeletePrepare}>Delete Gym</button>
        </div>
      </div>

      {/* stats, owner, etc (same as before) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}><p className={styles.statLabel}>Members</p><h3 className={styles.statValue}>{gym.members}</h3></div>
        <div className={styles.statCard}><p className={styles.statLabel}>Revenue</p><h3 className={styles.statValue}>${gym.revenue.toLocaleString()}</h3></div>
        <div className={styles.statCard}><p className={styles.statLabel}>Trainers</p><h3 className={styles.statValue}>{gym.trainers}</h3></div>
        <div className={styles.statCard}><p className={styles.statLabel}>Total Subscriptions</p><h3 className={styles.statValue}>{gym.subscriptions.total}</h3></div>
      </div>

      <div className={styles.card}><h2 className={styles.sectionTitle}>Owner Details</h2><div className={styles.row}><p><strong>Name:</strong> {gym.owner.name}</p><p><strong>Email:</strong> {gym.owner.email}</p><p><strong>Phone:</strong> {gym.owner.phone}</p></div></div>

      <div className={styles.card}><h2 className={styles.sectionTitle}>Subscription Metrics</h2><div className={styles.row}><p><strong>Active:</strong> {gym.subscriptions.active}</p><p><strong>Expired:</strong> {gym.subscriptions.expired}</p></div></div>

      <div className={styles.card}><h2 className={styles.sectionTitle}>Gym Location</h2><p>{gym.address}</p></div>

      {showEdit && <EditGymModal gym={gym} onClose={() => setShowEdit(false)} onSave={handleSave} />}

      <ConfirmationModal
        isOpen={confirm.open}
        title={
          confirm.type === "delete"
            ? "Delete Gym"
            : confirm.type === "suspend"
            ? "Suspend Gym"
            : "Activate Gym"
        }
        message={
          confirm.type === "delete"
            ? "This action will permanently delete the gym and all its data. Are you sure?"
            : confirm.type === "suspend"
            ? "Suspending the gym will prevent members from accessing the gym. Continue?"
            : "Activate this gym to allow members to access it."
        }
        confirmLabel={confirm.type === "delete" ? "Delete" : "Confirm"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm({ open:false, type:null })}
      />
    </div>
  );
};

export default GymDetails;
