import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Bell,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import api from "../../api/axios";
import { useAlert } from "../../context/AlertContext";
import styles from "./Announcements.module.css";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { confirm } = useAlert();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    tag: "general",
  });

  /* =========================
     LOAD ANNOUNCEMENTS
  ========================= */
  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/announcements");
      setAnnouncements(res.data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required");
      return;
    }

    // ✅ THIS IS THE PAYLOAD (EXACTLY HERE)
    const payload = {
      title: formData.title,
      message: formData.message,
      tag: formData.tag,
    };

    try {
      if (editingId) {
        await api.put(`/gymadmin/announcements/${editingId}`, payload);
      } else {
        await api.post("/gymadmin/announcements", payload);
      }

      resetForm();
      loadAnnouncements();
    } catch (err) {
      console.error(err);
      setError("Failed to save announcement");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", message: "", tag: "general" });
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!(await confirm("Delete this announcement?", { title: "Delete Announcement", confirmLabel: "Delete", type: "danger" }))) return;

    try {
      await api.delete(`/gymadmin/announcements/${id}`);
      loadAnnouncements();
    } catch (err) {
      setError("Failed to delete announcement");
    }
  };

  /* =========================
     STATS
  ========================= */
  const stats = {
    total: announcements.length,
    alerts: announcements.filter(a => a.tag === "alert").length,
    events: announcements.filter(a => a.tag === "event").length,
    updates: announcements.filter(a => a.tag === "update").length,
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <Bell size={24} /> Announcements
        </h1>

        <div className={styles.headerActions}>
          <button onClick={loadAnnouncements} disabled={loading}>
            <RefreshCw size={18} />
          </button>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X /> : <Plus />}
            {showForm ? "Cancel" : "New"}
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className={styles.statsGrid}>
        <div>Total: {stats.total}</div>
        <div>Alerts: {stats.alerts}</div>
        <div>Events: {stats.events}</div>
        <div>Updates: {stats.updates}</div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />

          <select
            value={formData.tag}
            onChange={(e) =>
              setFormData({ ...formData, tag: e.target.value })
            }
          >
            <option value="general">General</option>
            <option value="alert">Alert</option>
            <option value="event">Event</option>
            <option value="update">Update</option>
          </select>

          <button type="submit">
            {editingId ? "Update" : "Publish"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : announcements.length === 0 ? (
        <p>No announcements yet</p>
      ) : (
        <div className={styles.announcementsGrid}>
          {announcements.map((a) => (
            <div key={a.id} className={styles.announcementCard}>
              <h3>{a.title}</h3>
              <small>
                <Calendar size={14} />{" "}
                {new Date(a.created_at).toLocaleString()}
              </small>
              <p>{a.message}</p>

              <div className={styles.actions}>
                <button
                  onClick={() => {
                    setEditingId(a.id);
                    setFormData({
                      title: a.title,
                      message: a.message,
                      tag: a.tag,
                    });
                    setShowForm(true);
                  }}
                >
                  <Edit size={16} />
                </button>

                <button onClick={() => handleDelete(a.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
