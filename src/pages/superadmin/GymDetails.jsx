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
      <button className={styles.backBtn} onClick={() => navigate("/superadmin/gyms")}>
        ← Back
      </button>

      <h1 className={styles.title}>{gym.name}</h1>

      <div className={styles.card}>
        <div><span>Owner Email</span><strong>{gym.owner_email || "Not assigned"}</strong></div>
        <div><span>Location</span><strong>{gym.address || "N/A"}</strong></div>
        <div><span>Members</span><strong>{gym.members}</strong></div>
        <div><span>Monthly Revenue</span>
          <strong>KES {gym.monthly_revenue_ksh.toLocaleString()}</strong>
        </div>
      </div>

      <p className={styles.note}>
        Revenue, members & subscriptions auto-update as activity increases.
      </p>
    </div>

  );
};

export default GymDetails;
