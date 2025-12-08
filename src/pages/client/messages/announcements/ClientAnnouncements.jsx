import React from "react";
import styles from "./ClientAnnouncements.module.css";
import { Megaphone } from "lucide-react";

const ClientAnnouncements = () => {
  const announcements = [
    {
      id: 1,
      title: "Gym Closed Sunday",
      message: "We will be closed for maintenance. Back to normal Monday.",
      date: "Feb 10, 2025",
      type: "info",
    },
    {
      id: 2,
      title: "New Yoga Classes",
      message: "Early-morning yoga now available at 6AM.",
      date: "Feb 7, 2025",
      type: "update",
    },
    {
      id: 3,
      title: "Membership Discount",
      message: "Renew early and get 15% off for 3 months!",
      date: "Feb 5, 2025",
      type: "promo",
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Announcements</h2>

      <div className={styles.list}>
        {announcements.map(a => (
          <div key={a.id} className={`${styles.card} ${styles[a.type]}`}>
            <div className={styles.header}>
              <Megaphone className={styles.icon} />
              <h3>{a.title}</h3>
            </div>

            <p className={styles.message}>{a.message}</p>
            <p className={styles.date}>{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientAnnouncements;
