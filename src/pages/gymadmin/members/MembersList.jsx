import React, { useState, useMemo } from "react";
import styles from "./MembersList.module.css";
import AddMemberModal from "./AddMemberModal";
import { useNavigate } from "react-router-dom";

const MOCK_MEMBERS = [
  { id: 1, name: "Samuel Karanja", plan: "Monthly", expires: "2025-03-12", status: "active" },
  { id: 2, name: "Joyce Mutheu", plan: "Weekly", expires: "2025-02-02", status: "expired" },
  { id: 3, name: "James Mwangi", plan: "Daily", expires: "2025-01-30", status: "active" },
];

const MembersList = () => {
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_MEMBERS.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Members</h1>
          <p className={styles.subtitle}>Manage gym members and subscriptions.</p>
        </div>

        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          + Add Member
        </button>
      </div>

      <input
        className={styles.search}
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Expires</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.plan}</td>
              <td>
                <span className={`${styles.status} ${styles[m.status]}`}>
                  {m.status}
                </span>
              </td>
              <td>{m.expires}</td>
              <td>
                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/gymadmin/members/${m.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};

export default MembersList;
