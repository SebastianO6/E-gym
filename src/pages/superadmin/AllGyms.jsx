import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Eye } from "lucide-react";
import AddGymModal from "./AddGymModal/AddGymModal";
import ConfirmationModal from "./common/ConfirmationModal";
import styles from "./AllGyms.module.css";
import { getAllGyms } from "../../services/superadminService";
import api from "../../api/axios";

const AllGyms = () => {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    const data = await getAllGyms();
    setGyms(Array.isArray(data) ? data : []);
  };

  const handleGymCreated = (gym) => {
    setGyms((prev) => [...prev, gym]);
    setShowModal(false);
  };

  const confirmDeleteGym = async () => {
    await api.delete(`/superadmin/gyms/${confirmDelete}`);
    setGyms((prev) => prev.filter((g) => g?.id !== confirmDelete));
    setConfirmDelete(null);
  };

  // ✅ SAFE FILTER (FIXES CRASH)
  const filteredGyms = useMemo(() => {
    const safeGyms = Array.isArray(gyms) ? gyms : [];
    return safeGyms.filter(
      (g) =>
        g &&
        g.name &&
        g.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [gyms, search]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1>All Gyms</h1>
        <button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add New Gym
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <Search size={18} />
        <input
          placeholder="Search gyms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Gym</th>
            <th>Owner Email</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredGyms.map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td>{g.owner_email || "-"}</td>
              <td>{g.status || "active"}</td>
              <td className={styles.actions}>
                <Eye onClick={() => navigate(`/superadmin/gyms/${g.id}`)} />
                <Trash2 onClick={() => setConfirmDelete(g.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddGymModal
          onClose={() => setShowModal(false)}
          onCreate={handleGymCreated}
        />
      )}

      <ConfirmationModal
        isOpen={Boolean(confirmDelete)}
        title="Delete Gym"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteGym}
        onCancel={() => setConfirmDelete(null)}
        type="danger"
      />
    </div>
  );
};

export default AllGyms;
