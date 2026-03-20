import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AlertDialog from "../components/alerts/AlertDialog";
import ConfirmationModal from "../pages/superadmin/common/ConfirmationModal";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({ open: false, title: "Notice", message: "" });
  const [confirmState, setConfirmState] = useState({ open: false, title: "Please Confirm", message: "" });
  const confirmResolver = useRef(null);

  useEffect(() => {
    const originalAlert = window.alert;

    window.alert = (message) => {
      setAlertState({
        open: true,
        title: "Notice",
        message: typeof message === "string" ? message : String(message),
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const confirm = (message, options = {}) =>
    new Promise((resolve) => {
      confirmResolver.current = resolve;
      setConfirmState({
        open: true,
        title: options.title || "Please Confirm",
        message,
        confirmLabel: options.confirmLabel || "Confirm",
        type: options.type || "info",
      });
    });

  const value = useMemo(() => ({ confirm }), []);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertDialog
        isOpen={alertState.open}
        title={alertState.title}
        message={alertState.message}
        onClose={() => setAlertState((prev) => ({ ...prev, open: false }))}
      />
      <ConfirmationModal
        isOpen={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        type={confirmState.type}
        onConfirm={() => {
          setConfirmState((prev) => ({ ...prev, open: false }));
          confirmResolver.current?.(true);
          confirmResolver.current = null;
        }}
        onCancel={() => {
          setConfirmState((prev) => ({ ...prev, open: false }));
          confirmResolver.current?.(false);
          confirmResolver.current = null;
        }}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
