import React, { useEffect, useState } from "react";
import { RefreshCw, Shield, Trash2 } from "lucide-react";

import { useAlert } from "../../../context/AlertContext";
import { cleanupAuditLogs, getAuditLogs } from "../../../services/superadminService";
import styles from "./SuperAdminAuditLogs.module.css";

const SuperAdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { confirm } = useAlert();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs(200);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteOlder = async (olderThanDays) => {
    const ok = await confirm(
      `Delete audit logs older than ${olderThanDays} days?`,
      {
        title: "Delete Old Logs",
        confirmLabel: "Delete",
        type: "danger",
      }
    );
    if (!ok) return;

    try {
      setDeleting(true);
      const result = await cleanupAuditLogs({
        mode: "older_than",
        older_than_days: olderThanDays,
      });
      window.alert(`${result.deleted_count || 0} audit logs deleted.`);
      await fetchLogs();
    } catch (err) {
      console.error("Failed to delete audit logs", err);
      window.alert(err.response?.data?.error || "Failed to delete audit logs.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    const ok = await confirm(
      "Delete all audit logs? This cannot be undone.",
      {
        title: "Clear Audit Logs",
        confirmLabel: "Delete All",
        type: "danger",
      }
    );
    if (!ok) return;

    try {
      setDeleting(true);
      const result = await cleanupAuditLogs({ mode: "all" });
      window.alert(`${result.deleted_count || 0} audit logs deleted.`);
      await fetchLogs();
    } catch (err) {
      console.error("Failed to clear audit logs", err);
      window.alert(err.response?.data?.error || "Failed to clear audit logs.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1><Shield size={26} /> Audit Logs</h1>
          <p>Track platform activity and administrative actions</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.refreshBtn} onClick={fetchLogs} disabled={loading || deleting}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className={styles.cleanupBtn} onClick={() => handleDeleteOlder(30)} disabled={deleting}>
            <Trash2 size={16} /> Delete 30+ Days
          </button>
          <button className={styles.clearBtn} onClick={handleDeleteAll} disabled={deleting}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div className={styles.loading}>Loading logs...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td>{log.user}</td>
                    <td>
                      <span className={styles.action}>{log.action}</span>
                    </td>
                    <td>{log.entity}{log.entity_id ? ` #${log.entity_id}` : ""}</td>
                    <td className={styles.details}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuperAdminAuditLogs;
