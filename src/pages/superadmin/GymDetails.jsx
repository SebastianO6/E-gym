import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Ban, CheckCircle, Trash2, User, Mail, Phone, MapPin } from "lucide-react";
import EditGymModal from "./EditGymModal.jsx";
import ConfirmationModal from "./common/ConfiramtionModal.jsx";
import styles from "./GymDetails.module.css";

const MOCK_GYMS = {
  1: { id:1, name:"FitZone Downtown", status:"active", owner:{name:"John Doe", email:"john@example.com", phone:"+1 555 222 1111"}, members:245, revenue:24500, trainers:12, subscriptions:{ total:340, active:210, expired:130 }, address:"123 Main Street, Downtown" },
  2: { id:2, name:"PowerGym East", status:"pending", owner:{name:"Sarah Jones", email:"sarah@example.com", phone:"+1 555 000 3333"}, members:189, revenue:18900, trainers:9, subscriptions:{ total:300, active:160, expired:140 }, address:"89 East Avenue" },
};

const GymDetails = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, type: null });

  useEffect(() => {
    if (gymId) {
        const data = MOCK_GYMS[gymId];
        setGym(data);
    }
  }, [gymId]);

  if (!gym) return <div style={{padding: 40, textAlign: 'center'}}>Loading...</div>;

  const handleSave = (updated) => {
    setGym(updated);
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
    } else if (confirm.type === "activate") {
      setGym({ ...gym, status: "active" });
    } else if (confirm.type === "delete") {
      setGym(null);
      navigate('/superadmin/gyms');
    }
    setConfirm({ open:false, type:null });
  };

  return (
    <div className={styles.container}>
        {/* Navigation Back */}
        <button onClick={() => navigate('/superadmin/gyms')} className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Gyms
        </button>

      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.gymTitleRow}>
            <h1 className={styles.gymName}>{gym.name}</h1>
            <span className={`${styles.badge} ${styles[gym.status]}`}>
                {gym.status}
            </span>
          </div>
          <div className={styles.address}>
              <MapPin size={14} /> {gym.address}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setShowEdit(true)}>
            <Edit2 size={16} /> Edit
          </button>
          
          <button 
            className={`${styles.btn} ${styles.btnAction} ${gym.status === "active" ? styles.btnSuspend : styles.btnActivate}`}
            onClick={handleTogglePrepare}
          >
            {gym.status === "active" ? <><Ban size={16} /> Suspend</> : <><CheckCircle size={16} /> Activate</>}
          </button>
          
          <button className={`${styles.btn} ${styles.btnDelete}`} onClick={handleDeletePrepare}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {[
            { label: 'Members', value: gym.members },
            { label: 'Revenue', value: `$${gym.revenue.toLocaleString()}` },
            { label: 'Trainers', value: gym.trainers },
            { label: 'Total Subscriptions', value: gym.subscriptions.total }
        ].map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
                <p className={styles.statLabel}>{stat.label}</p>
                <h3 className={styles.statValue}>{stat.value}</h3>
            </div>
        ))}
      </div>

      {/* Details Grid */}
      <div className={styles.detailsGrid}>
        {/* Owner Details */}
        <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Owner Details</h2>
            <div>
                <div className={styles.infoRow}>
                    <div className={styles.iconBox}><User size={20} /></div>
                    <div>
                        <p className={styles.infoLabel}>Full Name</p>
                        <p className={styles.infoText}>{gym.owner.name}</p>
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.iconBox}><Mail size={20} /></div>
                    <div>
                        <p className={styles.infoLabel}>Email Address</p>
                        <p className={styles.infoText}>{gym.owner.email}</p>
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.iconBox}><Phone size={20} /></div>
                    <div>
                        <p className={styles.infoLabel}>Phone Number</p>
                        <p className={styles.infoText}>{gym.owner.phone}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Subscription Metrics */}
        <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Subscription Metrics</h2>
            <div className={styles.subMetricGrid}>
                <div className={`${styles.subMetric} ${styles.subMetricActive}`}>
                    <p className={styles.subMetricLabel}>Active Subscriptions</p>
                    <p className={styles.subMetricValue}>{gym.subscriptions.active}</p>
                </div>
                <div className={`${styles.subMetric} ${styles.subMetricExpired}`}>
                    <p className={styles.subMetricLabel}>Expired</p>
                    <p className={styles.subMetricValue}>{gym.subscriptions.expired}</p>
                </div>
            </div>
        </div>
      </div>

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
        type={confirm.type === "delete" ? "danger" : "info"}
      />
    </div>
  );
};

export default GymDetails;