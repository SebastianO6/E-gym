import React, { useEffect, useMemo, useState } from "react";
import styles from "./MembersList.module.css";
import AddMemberModal from "./AddMemberModal";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { listMembers } from "../../../services/gymAdminService";

const MembersList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const loadMembers = async () => {
    try {
      const data = await listMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load members failed:", err);
      setMembers([]);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((m) =>
      (m?.email || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>Members</h1>
        <button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <Search size={18} />
        <input
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.email}</td>
              <td>{m.plan}</td>
              <td>{m.status}</td>
              <td>
                <button onClick={() => navigate(`/gymadmin/members/${m.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && (
        <AddMemberModal
          onClose={() => setShowAdd(false)}
          onCreated={loadMembers}
        />
      )}
    </div>
  );
};

export default MembersList;
