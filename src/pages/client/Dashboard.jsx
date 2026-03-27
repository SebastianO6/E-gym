import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { Dumbbell, MessageCircle, ClipboardList, Bell} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientSchedule from "./clientSchedule";
import api from "../../api/axios";
import { getAnnouncements } from "../../services/clientService";
import { connectSocket } from "../../socket";
import { getAuthToken } from "../../utils/authLocal";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const loadDashboard = () => {
    Promise.all([
      getAnnouncements(),
      api.get("/client/plans"),
      api.get("/client/membership/me")
    ])
      .then(([annRes, planRes, memberRes]) => {
        if (!isMounted) return;
        setAnnouncements(annRes || []);
        setPlans(planRes.data || []);
        setMembership(memberRes.data || null);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
  };

  loadDashboard();
  const intervalId = setInterval(loadDashboard, 15000);
  const token = getAuthToken();
  const socket = connectSocket(token);

  if (socket) {
    socket.on("announcement_created", loadDashboard);
    socket.on("announcement_updated", loadDashboard);
    socket.on("announcement_deleted", loadDashboard);
  }

  return () => {
    isMounted = false;
    clearInterval(intervalId);
    if (socket) {
      socket.off("announcement_created", loadDashboard);
      socket.off("announcement_updated", loadDashboard);
      socket.off("announcement_deleted", loadDashboard);
    }
  };
}, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 40, textAlign: "center" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const activePlan = plans[0];

  return (
    <div className={styles.container}>

      <div className={styles.headerCard}>
        <h1>Welcome Back 👋</h1>
        <p>Your fitness journey continues today! Stay consistent.</p>
      </div>

      <div className={styles.statsGrid}>

        <div className={styles.statCard} onClick={() => navigate('/client/plan')}>
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <Dumbbell size={24} />
          </div>
          <h3>Active Plan</h3>
          <p>{activePlan ? activePlan.title : "No Plan Assigned"}</p>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.green}`}>
            <ClipboardList size={24} />
          </div>
          <h3>Subscription</h3>
          <p>
            {membership?.expired
              ? "Expired"
              : membership?.due_date
              ? `Valid until ${new Date(membership.due_date + "T00:00:00").toLocaleDateString()}`
              : "No Subscription"}
          </p>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/client/messages')}>
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
            <MessageCircle size={24} />
          </div>
          <h3>Messages</h3>
          <p>Open Chat</p>
        </div>

        <div className={styles.statCard} onClick={() => navigate('/client/announcements')}>
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
            <Bell size={24} />
          </div>
          <h3>Announcements</h3>
          <p>
            {announcements.length === 0
              ? "No updates"
              : `${announcements.length} update${announcements.length > 1 ? "s" : ""}`}
          </p>
        </div>

      </div>

      <ClientSchedule />
    </div>
  );
};

export default ClientDashboard;
