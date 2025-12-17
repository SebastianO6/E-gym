import React, { useState, useMemo } from "react";
import styles from "./MembersList.module.css";
import AddMemberModal from "../members/AddMemberModal";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

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
      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Members</h1>
          <p className={styles.subtitle}>Manage gym members and subscriptions.</p>
        </div>

        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expires</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.name}</td>
                  <td>{m.plan}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[m.status.toLowerCase()]}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>{m.expires}</td>
                  <td style={{ textAlign: "right" }}>
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
        </div>
      </div>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};

export default MembersList;