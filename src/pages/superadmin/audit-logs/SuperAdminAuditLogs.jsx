import React, { useEffect, useState } from "react";
import { Shield, RefreshCw } from "lucide-react";
import api from "../../../api/axios";
import styles from "./SuperAdminAuditLogs.module.css";

const SuperAdminAuditLogs = () => {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/superadmin/audit-logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <div>
          <h1><Shield size={26}/> Audit Logs</h1>
          <p>Track platform activity and administrative actions</p>
        </div>

        <button className={styles.refreshBtn} onClick={fetchLogs}>
          <RefreshCw size={16}/> Refresh
        </button>
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
                    <td>
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td>{log.user}</td>

                    <td>
                      <span className={styles.action}>
                        {log.action}
                      </span>
                    </td>

                    <td>{log.entity}</td>

                    <td className={styles.details}>
                      {log.details}
                    </td>
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