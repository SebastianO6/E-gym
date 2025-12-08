import React from "react";
import styles from "./confirmationModal.module.css";

const ConfirmationModal = ({ isOpen, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>{cancelLabel}</button>
          <button className={styles.confirm} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
