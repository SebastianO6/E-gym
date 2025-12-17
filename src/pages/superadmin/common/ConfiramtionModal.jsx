import React from "react";
import { Info, Trash2 } from "lucide-react";
import styles from "./ConfirmationModal.module.css";

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel, 
  onConfirm, 
  onCancel,
  type = "info"
}) => {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>
          <div className={`${styles.iconWrapper} ${isDanger ? styles.dangerIcon : styles.infoIcon}`}>
            {isDanger ? <Trash2 size={20} /> : <Info size={20} />}
          </div>
          <div className={styles.content}>
            <h3>{title}</h3>
            <p>{message}</p>
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`${styles.confirmBtn} ${isDanger ? styles.confirmBtnDanger : styles.confirmBtnInfo}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;