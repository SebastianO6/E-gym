import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Download, Mail, User, Briefcase, Building } from "lucide-react";
import {
  listTrainers,
  createTrainer,
  deleteTrainer,
  updateTrainer
} from "../../../services/gymAdminService";
import TrainerForm from "../../gymadmin/trainers/TrainerForm";
import styles from "./TrainersList.module.css";

const TrainersList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);

  // Load trainers from API
  const loadTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listTrainers();
      setTrainers(items || []);
    } catch (error) {
      console.error("Error loading trainers:", error);
      setError("Failed to load trainers. Please try again.");
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  // Filter trainers based on search
  const filteredTrainers = trainers.filter(trainer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      trainer.email?.toLowerCase().includes(searchLower) ||
      (trainer.bio && trainer.bio.toLowerCase().includes(searchLower))
    );
  });

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTrainer(null);
    loadTrainers(); // Refresh the list
  };

  // Handle edit trainer
  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setShowForm(true);
  };

  // Handle delete trainer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTrainer(id);
      loadTrainers(); // Refresh list
    } catch (error) {
      console.error("Error deleting trainer:", error);
      alert("Failed to delete trainer. Please try again.");
    }
  };

  // Handle create trainer (called from form)
  const handleCreateTrainer = async (formData) => {
    try {
      await createTrainer(formData);
      return true;
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  };

  // Handle update trainer (called from form)
  const handleUpdateTrainer = async (id, formData) => {
    try {
      await updateTrainer(id, formData);
      return true;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading trainers...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Trainers Management</h1>
          <p className={styles.subtitle}>
            Manage all trainers in your gym • {trainers.length} total trainers
          </p>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => {
            setEditingTrainer(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add New Trainer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={loadTrainers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <User size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{trainers.length}</h3>
            <p>Total Trainers</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Mail size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{trainers.filter(t => t.email).length}</h3>
            <p>Active Emails</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Briefcase size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{trainers.filter(t => t.bio && t.bio.trim().length > 0).length}</h3>
            <p>With Bio</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{new Set(trainers.map(t => t.gym_id)).size}</h3>
            <p>Unique Gyms</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search by email or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.exportButton}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Trainers Table */}
      <div className={styles.tableContainer}>
        {filteredTrainers.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👨‍🏫</div>
            <h3>No trainers found</h3>
            <p>{searchTerm ? "Try adjusting your search" : "Add your first trainer to get started"}</p>
            <button 
              className={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Add New Trainer
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Trainer ID</th>
                <th>Email & User ID</th>
                <th>Bio</th>
                <th>Gym ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id} className={styles.tableRow}>
                  <td className={styles.idCell}>
                    <div className={styles.trainerId}>#{trainer.id}</div>
                  </td>
                  <td className={styles.emailCell}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {trainer.email?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div className={styles.userDetails}>
                        <div className={styles.email}>{trainer.email || "No email"}</div>
                        <div className={styles.userId}>User ID: {trainer.user_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.bioCell}>
                    {trainer.bio ? (
                      <div className={styles.bioText}>{trainer.bio}</div>
                    ) : (
                      <span className={styles.noBio}>— No bio —</span>
                    )}
                  </td>
                  <td className={styles.gymIdCell}>
                    <div className={styles.gymId}>
                      <Building size={14} />
                      {trainer.gym_id || "—"}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEdit(trainer)}
                        title="Edit Trainer"
                      >
                        <Edit size={16} />
                        <span className={styles.btnText}>Edit</span>
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(trainer.id)}
                        title="Delete Trainer"
                      >
                        <Trash2 size={16} />
                        <span className={styles.btnText}>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Trainer Form Modal */}
      {showForm && (
        <TrainerForm
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingTrainer(null);
          }}
          existingTrainer={editingTrainer}
          onCreate={handleCreateTrainer}
          onUpdate={handleUpdateTrainer}
        />
      )}
    </div>
  );
};

export default TrainersList;