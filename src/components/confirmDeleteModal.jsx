import styles from "./ConfirmDeleteModal.module.css";

export default function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onCancel
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className={styles.delete}
            onClick={onConfirm}
          >
            Permanently Delete
          </button>
        </div>

      </div>
    </div>
  );
}