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
      <button onClick={() => navigate("/superadmin/gyms")}>← Back</button>
      <h1>{gym.name}</h1>

      <p><b>Owner Email:</b> {gym.owner_email}</p>
      <p><b>Phone:</b> {gym.phone}</p>
      <p><b>Address:</b> {gym.address}</p>

      <p style={{ opacity: 0.6 }}>
        Revenue, members & subscriptions will auto-populate once aggregation is enabled.
      </p>
    </div>
  );
};

export default GymDetails;
