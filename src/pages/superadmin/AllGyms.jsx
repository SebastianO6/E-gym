import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Eye, Pencil } from "lucide-react";
import AddGymModal from "./AddGymModal/AddGymModal";
import EditGymModal from "./EditGymModal";
import ConfirmationModal from "./common/ConfirmationModal";
import styles from "./AllGyms.module.css";
import api from "../../api/axios";

const AllGyms = () => {
  const navigate = useNavigate();

  const [gyms, setGyms] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGym, setEditingGym] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load gyms from backend
  const loadGyms = async () => {
    try {
      const res = await api.get("/superadmin/gyms");
      setGyms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load gyms", err);
    }
  };

  useEffect(() => {
    loadGyms();
  }, []);

  // Handle creation
  const handleGymCreated = (gym) => {
    setGyms((prev) => [...prev, gym]);
    setShowModal(false);
  };

  // Delete gym
  const confirmDeleteGym = async () => {
    try {
      await api.delete(`/superadmin/gyms/${confirmDelete}`);
      setGyms((prev) => prev.filter((g) => g.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Activate / Deactivate gym
  const toggleGymStatus = async (gym) => {
    try {
      // Determine endpoint based on current status
      const endpoint = gym.status === "active" ? "deactivate" : "activate";

      // Call backend
       await api.patch(`/superadmin/gyms/${gym.id}/${endpoint}`);

      // Update the local state with latest status from backend
      setGyms((prev) =>
        prev.map((g) =>
          g.id === gym.id
            ? { ...g, status: endpoint === "deactivate" ? "inactive" : "active" }
            : g
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filter gyms safely
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
            <th>Owner Phone</th>
            <th>Members</th>
            <th>Status</th>
            <th>Subscription</th> 
            <th />
          </tr>
        </thead>
        <tbody>
          {filteredGyms.map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td>{g.owner_email || "-"}</td>
              <td>{g.phone || "-"}</td>
              <td>{g.members || 0}</td>
              <td>
                <span className={g.status === "active" ? styles.active : styles.inactive}>
                  {g.status}
                </span>
              </td>
              <td>
                <span className={g.subscription_status === "active" ? styles.active : styles.inactive}>
                  {g.subscription_status}
                </span>
              </td>
              <td className={styles.actions}>
                <Eye onClick={() => navigate(`/superadmin/gyms/${g.id}`)} />
                <Pencil onClick={() => setEditingGym(g)} />
                <Trash2 onClick={() => setConfirmDelete(g.id)} />
                <button
                  onClick={() => toggleGymStatus(g)}
                  style={{
                    cursor: "pointer",
                    marginLeft: 8,
                    background: "none",
                    border: "none",
                    color: g.status === "active" ? "red" : "green",
                  }}
                >
                  {g.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingGym && (
        <EditGymModal
          gym={editingGym}
          onClose={() => setEditingGym(null)}
          onSave={async (updatedGym) => {
            await api.put(`/superadmin/gyms/${updatedGym.id}`, updatedGym);
            await loadGyms();
            setEditingGym(null);
          }}
        />
      )}

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