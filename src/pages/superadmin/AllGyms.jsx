import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Eye } from "lucide-react";
import AddGymModal from "./AddGymModal/AddGymModal.jsx";
import ConfirmationModal from "./common/ConfiramtionModal.jsx";
import styles from "./AllGyms.module.css";

// 🔥 Local mock data
const initialGyms = [
  { id: 1, name: "FitZone Downtown", owner: "John Doe", members: 245, revenue: 24500, status: "active" },
  { id: 2, name: "PowerGym East", owner: "Sarah Jones", members: 189, revenue: 18900, status: "pending" },
  { id: 3, name: "FlexFit North", owner: "Michael Scott", members: 312, revenue: 31200, status: "suspended" },
];

const AllGyms = () => {
  const navigate = useNavigate();

  const [gyms, setGyms] = useState(initialGyms);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const handleCreateGym = (data) => {
    const newGym = {
      id: gyms.length + 1,
      name: data.name,
      owner: data.owner.name,
      members: 0,
      revenue: 0,
      status: "pending",
    };
    setGyms((prev) => [newGym, ...prev]);
    setShowModal(false);
  };

  const askDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteGym = () => {
    setGyms((prev) => prev.filter((g) => g.id !== confirmDelete.id));
    setConfirmDelete({ open: false, id: null });
  };

  const filteredGyms = useMemo(() => {
    return gyms.filter((gym) =>
      gym.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, gyms]);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>All Gyms</h1>
          <p className={styles.subtitle}>Manage all gyms registered on the platform.</p>
        </div>

        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add New Gym
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search gyms by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gym Name</th>
                <th>Owner</th>
                <th>Members</th>
                <th>Revenue</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredGyms.length > 0 ? (
                filteredGyms.map((g) => (
                  <tr key={g.id}>
                    <td style={{ fontWeight: 500 }}>{g.name}</td>
                    <td>{g.owner}</td>
                    <td>{g.members}</td>
                    <td>${g.revenue.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[g.status]}`}>
                        {g.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.iconBtn}
                          title="View Details"
                          onClick={() => navigate(`/superadmin/gyms/${g.id}`)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Delete Gym"
                          onClick={() => askDelete(g.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.emptyState}>
                    No gyms found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddGymModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateGym}
        />
      )}

      <ConfirmationModal
        isOpen={confirmDelete.open}
        title="Delete Gym"
        message="Are you sure you want to delete this gym? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteGym}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
        type="danger"
      />
    </div>
  );
};

export default AllGyms;