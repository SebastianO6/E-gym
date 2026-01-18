import React, { useState, useEffect } from "react";
import { X, Mail, Lock, FileText, Building } from "lucide-react";
import "./TrainerForm.module.css";

const TrainerForm = ({ 
  onSuccess, 
  onCancel, 
  existingTrainer = null,
  onCreate,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    email: existingTrainer?.email || "",
    password: "",
    bio: existingTrainer?.bio || "",
    gym_id: existingTrainer?.gym_id || localStorage.getItem("gym_id") || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If editing, pre-fill the form
    if (existingTrainer) {
      setFormData({
        email: existingTrainer.email || "",
        password: "", // Don't pre-fill password
        bio: existingTrainer.bio || "",
        gym_id: existingTrainer.gym_id || ""
      });
    }
  }, [existingTrainer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!existingTrainer && !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!existingTrainer && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      // Prepare payload according to backend schema
      const payload = {
        email: formData.email,
        bio: formData.bio || "",
        gym_id: formData.gym_id || undefined
      };

      // Only include password for new trainers
      if (!existingTrainer && formData.password) {
        payload.password = formData.password;
      }

      if (existingTrainer) {
        // Update existing trainer
        if (onUpdate) {
          await onUpdate(existingTrainer.id, payload);
        }
      } else {
        // Create new trainer
        if (onCreate) {
          await onCreate(payload);
        }
      }
      
      onSuccess();
    } catch (error) {
      console.error("Save error:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "Failed to save trainer. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="trainer-form-modal">
        <div className="modal-header">
          <div>
            <h2>{existingTrainer ? "Edit Trainer" : "Add New Trainer"}</h2>
            <p className="modal-subtitle">
              {existingTrainer 
                ? `Update trainer #${existingTrainer.id}` 
                : "Add a new trainer to your gym"}
            </p>
          </div>
          <button className="close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="trainer-form">
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              className={`modern-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="trainer@example.com"
              required
              disabled={!!existingTrainer}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {!existingTrainer && (
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} />
                Password *
              </label>
              <input
                type="password"
                name="password"
                className={`modern-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required={!existingTrainer}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <FileText size={16} />
              Bio / Description
            </label>
            <textarea
              name="bio"
              className="modern-input"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Certifications, experience, specialties..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Building size={16} />
              Gym ID
            </label>
            <input
              type="number"
              name="gym_id"
              className="modern-input"
              value={formData.gym_id}
              onChange={handleChange}
              placeholder="e.g., 1, 2, 3..."
            />
            <small className="form-hint">
              Leave empty to use your current gym
            </small>
          </div>

          {errors.general && (
            <div className="alert-error">
              ⚠️ {errors.general}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  {existingTrainer ? "Updating..." : "Creating..."}
                </>
              ) : (
                existingTrainer ? "Update Trainer" : "Create Trainer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;