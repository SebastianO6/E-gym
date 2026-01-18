import React from "react";
import styles from "./Dashboard.module.css";
import { Dumbbell, MessageCircle, ClipboardList, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientSchedule from "./clientSchedule";

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>

      <div className={styles.headerCard}>
        <h1>Welcome Back, Alex 👋</h1>
        <p>Your fitness journey continues today! Stay consistent.</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>

        <div className={styles.statCard} onClick={() => navigate('/client/plan')}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <Dumbbell size={24} />
          </div>
          <h3>Active Plan</h3>
          <p>Strength + Cardio</p>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.green}`}>
             <ClipboardList size={24} />
          </div>
          <h3>Next Workout</h3>
          <p>Leg Day • Tomorrow</p>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/client/messages')}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
             <MessageCircle size={24} />
          </div>
          <h3>Messages</h3>
          <p>2 New Messages</p>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/client/announcements')}>
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
             <Bell size={24} />
          </div>
          <h3>Announcements</h3>
          <p>No new updates</p>
        </div>

      </div>

      <ClientSchedule />

    </div>
  );
};

export default ClientDashboard;