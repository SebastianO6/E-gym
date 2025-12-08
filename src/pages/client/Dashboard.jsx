import React from "react";
import styles from "./Dashboard.module.css";
import { Dumbbell, MessageCircle, ClipboardList, Bell } from "lucide-react";

const ClientDashboard = () => {
  return (
    <div className={styles.container}>

      <div className={styles.headerCard}>
        <h1>Welcome Back 👋</h1>
        <p>Your fitness journey continues today!</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <Dumbbell className={styles.icon} />
          <h3>Active Plan</h3>
          <p>Strength + Cardio</p>
        </div>

        <div className={styles.statCard}>
          <ClipboardList className={styles.icon} />
          <h3>Next Workout</h3>
          <p>Leg Day • Tomorrow</p>
        </div>

        <div className={styles.statCard}>
          <MessageCircle className={styles.icon} />
          <h3>Messages</h3>
          <p>2 new</p>
        </div>

        <div className={styles.statCard}>
          <Bell className={styles.icon} />
          <h3>Announcements</h3>
          <p>No unread</p>
        </div>

      </div>

    </div>
  );
};

export default ClientDashboard;
