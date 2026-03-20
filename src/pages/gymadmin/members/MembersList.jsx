import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listMembers, deactivateMember, activateMember } from "../../../services/gymAdminService";
import { useAlert } from "../../../context/AlertContext";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import { Search, Plus } from "lucide-react";
import styles from "./MembersList.module.css";

export default function MembersList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { confirm } = useAlert();

  const loadMembers = async () => {
    try {
      const data = await listMembers();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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

  const handleDeactivate = async (memberId) => {
    if (!(await confirm("Deactivate this member?", { title: "Deactivate Member", confirmLabel: "Deactivate", type: "danger" }))) return;
    try {
      await deactivateMember(memberId);
      await loadMembers();
      navigate("/gymadmin/members/expired");
    } catch (err) {
      alert("Failed to deactivate member");
    }
  };

  const handleActivate = async (memberId) => {
    try {
      await activateMember(memberId);
      await loadMembers();
    } catch (err) {
      console.warn(err);
      alert("Failed to activate member");
    }
  };

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>{m.email}</td>
              <td>{m.plan}</td>
              <td>{m.status}</td>
              <td>
                <button onClick={() => navigate(`/gymadmin/members/${m.id}`)}>View</button>
                <button onClick={() => setEditingMember(m)}>Edit</button>
                {m.status === "active" ? (
                  <button onClick={() => handleDeactivate(m.id)}>Deactivate</button>
                ) : (
                  <button onClick={() => handleActivate(m.id)}>Activate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && <AddMemberModal onClose={() => setShowAdd(false)} onCreated={loadMembers} />}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaved={loadMembers}
        />
      )}
    </div>
  );
}
