import { useEffect, useState } from "react";
import api from "../../../api/axios";
import styles from "./ExpiredMembers.module.css";

export default function ExpiredMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpired = async () => {
      try {
        const res = await api.get("/gymadmin/members/expired");
        setMembers(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch expired members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpired();
  }, []);

  if (loading) return <div className={styles.loading}>Loading expired members…</div>;

  return (
    <div className={styles.expiredPage}>
      <h1>❌ Expired / Inactive Members</h1>
      {members.length === 0 ? (
        <p className={styles.emptyState}>No expired members.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id}>
                  <td>{m.email}</td>
                  <td>{m.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}