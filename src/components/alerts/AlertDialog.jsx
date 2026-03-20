import React from "react";
import { Info } from "lucide-react";
import styles from "../../pages/superadmin/common/ConfirmationModal.module.css";

export default function AlertDialog({ isOpen, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>
          <div className={`${styles.iconWrapper} ${styles.infoIcon}`}>
            <Info size={20} />
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={`${styles.confirmBtn} ${styles.confirmBtnInfo}`}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
