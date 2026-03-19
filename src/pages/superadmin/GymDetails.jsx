import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./GymDetails.module.css";
import { getAllGyms } from "../../services/superadminService";
import { getGymSubscription } from "../../services/superadminService";
import RenewGymModal from "./RenewGymModal";

const GymDetails = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [subscription, setSubscription] = useState(null)
  const [showRenew, setShowRenew] = useState(false)
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadGym = async () => {
      const gyms = await getAllGyms();
      setGym(gyms.find((g) => g.id === Number(gymId)));

      const sub = await getGymSubscription(gymId);
      setSubscription(sub);
    };

    loadGym();
  }, [gymId]);

  const copyJoinLink = async () => {
    if (!gym?.join_url) return;
    await navigator.clipboard.writeText(gym.join_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
            {gym.owner_email ? (
              <a
                href={`mailto:${gym.owner_email}`}
                className={styles.email}
              >
                {gym.owner_email}
              </a>
            ) : (
              "Not assigned"
            )}
          </h3>
        </div>

        <div className={styles.subscriptionCard}>
          <h3>Gym Subscription</h3>

          {!subscription ? (
            <p>No subscription found</p>
          ) : (
            <>
              <p>
                <strong>Plan:</strong> {subscription.plan}
              </p>

              <p>
                <strong>Expires:</strong>{" "}
                {new Date(subscription.end_date).toLocaleDateString()}
              </p>

              <p>
                <strong>Days Remaining:</strong>{" "}
                {subscription.days_left}
              </p>

              <button
                className={styles.renewBtn}
                onClick={() => setShowRenew(true)}
              >
                Renew Gym Subscription
              </button>
            </>
          )}
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Phone</p>
          <h3 className={styles.statValue}>
            {gym.phone ? (
              <a href={`tel:${gym.phone}`} className={styles.phone}>
                {gym.phone}
              </a>
            ) : (
              "Not provided"
            )}
          </h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Location</p>
          <h3 className={styles.statValue}>
            {gym.address || "N/A"}
          </h3>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Member Join Link</p>
          <h3 className={styles.statValue}>{gym.slug || "N/A"}</h3>
          {gym.join_url && (
            <>
              <a href={gym.join_url} target="_blank" rel="noreferrer">
                Open registration page
              </a>
              <button
                className={styles.renewBtn}
                onClick={copyJoinLink}
                style={{ marginTop: 12 }}
              >
                {copied ? "Copied" : "Copy join link"}
              </button>
            </>
          )}
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
            KES {(gym.monthly_revenue_ksh || 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {showRenew && (
        <RenewGymModal
          gymId={gym.id}
          onClose={() => setShowRenew(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      <p className={styles.note}>
        Revenue, members & subscriptions automatically update as activity increases.
      </p>
    </div>
  );
};

export default GymDetails;
