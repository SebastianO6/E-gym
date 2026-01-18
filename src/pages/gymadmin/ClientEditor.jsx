import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import "./ClientEditor.css";

const ClientEditor = ({ clientId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    plan: "",
    status: "active",
    trainer_id: "",
    start_date: "",
    end_date: "",
    due_date: ""
  });
  const [trainers, setTrainers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClientData();
    loadTrainers();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gymadmin/members/${clientId}`);
      const client = response.data;
      
      setFormData({
        plan: client.plan || "",
        status: client.status || "active",
        trainer_id: client.trainer_id || "",
        start_date: client.start_date?.split("T")[0] || "",
        end_date: client.end_date?.split("T")[0] || "",
        due_date: client.due_date?.split("T")[0] || ""
      });
    } catch (error) {
      console.error("Failed to load client:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrainers = async () => {
    try {
      const response = await api.get("/gymadmin/trainers");
      setTrainers(response.data.items || []);
    } catch (error) {
      console.error("Failed to load trainers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      await api.put(`/gymadmin/members/${clientId}`, formData);
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to update client" });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading client details...</p>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="client-editor-modal">
        <div className="modal-header">
          <h2>Edit Client Details</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Membership Plan *</label>
              <select
                className="modern-input"
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                required
              >
                <option value="">Select Plan</option>
                <option value="Basic">Basic ($50/month)</option>
                <option value="Premium">Premium ($80/month)</option>
                <option value="Elite">Elite ($120/month)</option>
                <option value="Custom">Custom</option>
              </select>
              {errors.plan && <span className="error">{errors.plan}</span>}
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                className="modern-input"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Assign Trainer</label>
            <select
              className="modern-input"
              value={formData.trainer_id}
              onChange={(e) => setFormData({...formData, trainer_id: e.target.value})}
            >
              <option value="">No Trainer Assigned</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.email} {trainer.bio ? `(${trainer.bio.substring(0, 30)}...)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="modern-input"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                className="modern-input"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Due Date (Next Payment)</label>
            <input
              type="date"
              className="modern-input"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            />
          </div>

          <div className="subscription-summary">
            <h4>Subscription Summary</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Plan:</span>
                <span className="summary-value plan-badge">{formData.plan}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Status:</span>
                <span className={`summary-value status-badge ${formData.status}`}>
                  {formData.status}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration:</span>
                <span className="summary-value">
                  {formData.start_date && formData.end_date ? (
                    `${Math.ceil((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24))} days`
                  ) : "Not set"}
                </span>
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="alert-error">
              ⚠ {errors.general}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Client"}
            </button>
            <button type="button" className="btn-outline" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientEditor;