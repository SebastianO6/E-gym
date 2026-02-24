import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./GymDetails.module.css";
import { getAllGyms } from "../../services/superadminService";

const GymDetails = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);

  useEffect(() => {
    loadGym();
  }, [gymId]);

  const loadGym = async () => {
    const gyms = await getAllGyms();
    setGym(gyms.find((g) => g.id === Number(gymId)));
  };

  if (!gym) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/superadmin/gyms")}
      >
        ← Back to Gyms
      </button>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{gym.name}</h1>
          <p className={styles.subtitle}>
            Detailed gym overview and performance metrics
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Owner Email</p>
          <h3 className={styles.statValue}>
            {gym.owner_email || "Not assigned"}
          </h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Location</p>
          <h3 className={styles.statValue}>
            {gym.address || "N/A"}
          </h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Members</p>
          <h3 className={styles.statValue}>
            {gym.members}
          </h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Monthly Revenue</p>
          <h3 className={styles.statValue}>
            KES {gym.monthly_revenue_ksh.toLocaleString()}
          </h3>
        </div>
      </div>

      <p className={styles.note}>
        Revenue, members & subscriptions automatically update as activity increases.
      </p>
    </div>
  );
};

export default GymDetails;
