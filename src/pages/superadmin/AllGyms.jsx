// src/pages/superadmin/AllGyms.jsx
import React, { useState, useMemo } from "react";
import styles from "./AllGyms.module.css";
import { useNavigate } from "react-router-dom";

import AddGymModal from "./AddGymModal/AddGymModal";
import ConfirmationModal from "../../components/common/confirmationModal/confirmationModal";

// 🔥 Local mock data (will later come from API)
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

  // 🔥 Handle new gym creation
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

    // TODO later: api.post("/superadmin/gyms", data)

    setShowModal(false);
  };

  // 🔥 Ask confirmation before delete
  const askDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  // 🔥 Delete gym after confirmation
  const confirmDeleteGym = () => {
    setGyms((prev) => prev.filter((g) => g.id !== confirmDelete.id));

    // TODO later:
    // api.delete(`/superadmin/gyms/${confirmDelete.id}`)

    setConfirmDelete({ open: false, id: null });
  };

  // 🔍 Search filtering
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
          + Add New Gym
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search gyms…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gym Name</th>
              <th>Owner</th>
              <th>Members</th>
              <th>Revenue</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredGyms.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.owner}</td>
                <td>{g.members}</td>
                <td>${g.revenue.toLocaleString()}</td>
                <td>
                  <span className={`${styles.status} ${styles[g.status]}`}>
                    {g.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => navigate(`/superadmin/gyms/${g.id}`)}
                  >
                    View
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => askDelete(g.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ADD GYM MODAL */}
      {showModal && (
        <AddGymModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateGym}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmDelete.open}
        title="Delete Gym"
        message="Are you sure you want to delete this gym? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDeleteGym}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />
    </div>
  );
};

export default AllGyms;
