import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Edit, Trash2, Bell, Calendar, AlertCircle, RefreshCw, Building } from "lucide-react";
import api from "../../api/axios";
import styles from "./Announcements.module.css";

const Announcements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    tag: "general",
    gym_id: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [userGymId, setUserGymId] = useState(null);

  // Get user's gym_id from current user data or localStorage
  useEffect(() => {
    const getUserGymId = async () => {
      try {
        // Try to get gym_id from localStorage first
        const storedGymId = localStorage.getItem("gym_id");
        
        // If not in localStorage, try to get from current user
        if (!storedGymId) {
          // Get current user info (you might need to adjust this based on your auth setup)
          const response = await api.get("/auth/me");
          const userData = response.data;
          
          if (userData && userData.gym_id) {
            setUserGymId(userData.gym_id);
            localStorage.setItem("gym_id", userData.gym_id.toString());
          } else {
            // If still no gym_id, get it from the first request that might have it
            // For gym admin, their user should have gym_id
            const currentUserStr = localStorage.getItem("egym_user");
            if (currentUserStr) {
              try {
                const currentUser = JSON.parse(currentUserStr);
                if (currentUser && currentUser.gym_id) {
                  setUserGymId(currentUser.gym_id);
                  localStorage.setItem("gym_id", currentUser.gym_id.toString());
                }
              } catch (e) {
                console.error("Error parsing user data:", e);
              }
            }
          }
        } else {
          // Convert to number for consistency
          setUserGymId(parseInt(storedGymId, 10));
        }
      } catch (err) {
        console.error("Error getting user gym ID:", err);
      }
    };

    getUserGymId();
  }, []);

  useEffect(() => {
    if (userGymId !== null) {
      loadAnnouncements();
    }
  }, [userGymId]);

  const loadAnnouncements = async () => {
    if (userGymId === null) {
      setError("Please wait while we load your gym information...");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Use the user's gym_id
      const response = await api.get(`/gymadmin/announcements?gym_id=${userGymId}`);
      setAnnouncements(response.data || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      if (err.response?.status === 404) {
        setAnnouncements([]); // No announcements yet
      } else if (err.response?.status === 400) {
        setError("Invalid gym ID. Please contact support.");
      } else {
        setError("Failed to load announcements. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required");
      return;
    }

    // Validate gym_id - ensure it's a valid number
    const gymIdToUse = formData.gym_id ? parseInt(formData.gym_id, 10) : userGymId;
    
    if (!gymIdToUse || isNaN(gymIdToUse)) {
      setError("Invalid gym ID. Please enter a valid gym ID.");
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        tag: formData.tag,
        gym_id: gymIdToUse  // Ensure it's a number
      };

      if (editingId) {
        // Update existing announcement
        await api.put(`/gymadmin/announcements/${editingId}`, payload);
      } else {
        // Create new announcement
        await api.post("/gymadmin/announcements", payload);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        message: "",
        tag: "general",
        gym_id: ""
      });
      loadAnnouncements();
    } catch (err) {
      console.error("Failed to save announcement:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = [];
        if (err.response.data.errors.title) {
          errorMessages.push(`Title: ${err.response.data.errors.title[0]}`);
        }
        if (err.response.data.errors.message) {
          errorMessages.push(`Message: ${err.response.data.errors.message[0]}`);
        }
        if (err.response.data.errors.gym_id) {
          errorMessages.push(`Gym ID: ${err.response.data.errors.gym_id[0]}`);
        }
        setError(errorMessages.join(", ") || "Validation error");
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check your inputs and try again.");
      } else {
        setError("Failed to save announcement. Please try again.");
      }
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title || "",
      message: announcement.message || "",
      tag: announcement.tag || "general",
      gym_id: announcement.gym_id ? announcement.gym_id.toString() : ""
    });
    setEditingId(announcement.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      await api.delete(`/gymadmin/announcements/${id}`);
      loadAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to delete announcement");
      }
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      general: "#667eea",
      alert: "#f5576c",
      update: "#4facfe",
      event: "#43e97b",
      holiday: "#fa709a",
      maintenance: "#a8edea"
    };
    return colors[tag] || colors.general;
  };

  const getTagIcon = (tag) => {
    const icons = {
      general: "📢",
      alert: "⚠️",
      update: "🔄",
      event: "🎉",
      holiday: "🎄",
      maintenance: "🔧"
    };
    return icons[tag] || "📢";
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const getStats = () => {
    return {
      total: announcements.length,
      alerts: announcements.filter(a => a.tag === 'alert').length,
      events: announcements.filter(a => a.tag === 'event').length,
      updates: announcements.filter(a => a.tag === 'update').length
    };
  };

  const stats = getStats();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <Bell size={28} />
            Announcements
          </h1>
          <p className={styles.subtitle}>
            Create and manage announcements for all gym members
            {userGymId && (
              <span className={styles.gymInfo}>
                <Building size={12} /> Gym ID: {userGymId}
              </span>
            )}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.refreshBtn}
            onClick={loadAnnouncements}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            className={styles.addButton}
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                message: "",
                tag: "general",
                gym_id: userGymId ? userGymId.toString() : ""
              });
              setShowForm(!showForm);
            }}
            disabled={!userGymId}
            title={!userGymId ? "Please wait for gym information to load" : ""}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? "Cancel" : "New Announcement"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button 
            className={styles.dismissError}
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading Gym ID Message */}
      {!userGymId && !loading && (
        <div className={styles.warningAlert}>
          <AlertCircle size={20} />
          <span>Loading gym information... Please wait or try refreshing the page.</span>
          <button 
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      )}

      {/* Quick Stats */}
      {userGymId && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#e0f2fe" }}>
              <Bell size={24} color="#0369a1" />
            </div>
            <div className={styles.statContent}>
              <h3>{stats.total}</h3>
              <p>Total Announcements</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fee2e2" }}>
              <span style={{ color: "#dc2626" }}>⚠️</span>
            </div>
            <div className={styles.statContent}>
              <h3>{stats.alerts}</h3>
              <p>Active Alerts</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#f0fdf4" }}>
              <span style={{ color: "#16a34a" }}>🎉</span>
            </div>
            <div className={styles.statContent}>
              <h3>{stats.events}</h3>
              <p>Upcoming Events</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "#fef3c7" }}>
              <span style={{ color: "#d97706" }}>🔄</span>
            </div>
            <div className={styles.statContent}>
              <h3>{stats.updates}</h3>
              <p>Recent Updates</p>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form */}
      {showForm && userGymId && (
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingId ? "Edit Announcement" : "Create New Announcement"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Title *
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter announcement title..."
                  required
                  maxLength={200}
                />
                <div className={styles.charCount}>
                  {formData.title.length}/200 characters
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Category *
                </label>
                <div className={styles.tagGrid}>
                  {['general', 'alert', 'update', 'event', 'holiday', 'maintenance'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`${styles.tagOption} ${formData.tag === tag ? styles.tagActive : ''}`}
                      style={{ 
                        borderColor: getTagColor(tag),
                        background: formData.tag === tag ? getTagColor(tag) : 'transparent',
                        color: formData.tag === tag ? 'white' : getTagColor(tag)
                      }}
                      onClick={() => setFormData({...formData, tag})}
                    >
                      <span className={styles.tagIcon}>{getTagIcon(tag)}</span>
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Message *
                </label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Type your announcement message here..."
                  rows={6}
                  required
                />
                <div className={styles.charCount}>
                  {formData.message.length}/5000 characters
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Building size={16} />
                  Gym ID
                </label>
                <input
                  type="number"
                  className={styles.formInput}
                  value={formData.gym_id}
                  onChange={(e) => setFormData({...formData, gym_id: e.target.value})}
                  placeholder={`Current: ${userGymId}`}
                  min="1"
                  step="1"
                />
                <div className={styles.formHint}>
                  Leave empty to use your current gym ID ({userGymId})
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      message: "",
                      tag: "general",
                      gym_id: userGymId ? userGymId.toString() : ""
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className={styles.spinnerSmall}></div>
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingId ? "Update Announcement" : "Publish Announcement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {userGymId && (
        <div className={styles.announcementsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              All Announcements ({announcements.length})
            </h2>
            <div className={styles.sectionInfo}>
              Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} for Gym #{userGymId}
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📢</div>
              <h3>No announcements yet</h3>
              <p>Create your first announcement to notify all gym members</p>
              <button 
                className={styles.addButton}
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                Create First Announcement
              </button>
            </div>
          ) : (
            <div className={styles.announcementsGrid}>
              {announcements.map((announcement) => (
                <div key={announcement.id} className={styles.announcementCard}>
                  <div 
                    className={styles.announcementTag}
                    style={{ background: getTagColor(announcement.tag) }}
                  >
                    <span className={styles.tagIcon}>{getTagIcon(announcement.tag)}</span>
                    {announcement.tag.toUpperCase()}
                  </div>
                  
                  <div className={styles.announcementContent}>
                    <div className={styles.announcementHeader}>
                      <h3>{announcement.title}</h3>
                      <div className={styles.announcementMeta}>
                        <span className={styles.announcementDate}>
                          <Calendar size={14} />
                          {formatDate(announcement.created_at)}
                        </span>
                        <span className={styles.announcementGymId}>
                          <Building size={14} />
                          Gym #{announcement.gym_id || userGymId}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.announcementMessage}>
                      {announcement.message}
                    </div>
                  </div>

                  <div className={styles.announcementActions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleEdit(announcement)}
                      title="Edit"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(announcement.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;