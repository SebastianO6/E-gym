import React, { useState, useEffect } from "react";
import { X, Mail, FileText, Building } from "lucide-react";
import "./TrainerForm.module.css";

const TrainerForm = ({ onSuccess, onCancel, existingTrainer = null, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    email: "",
    bio: "",
    gym_id: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingTrainer) {
      setFormData({
        email: existingTrainer.email || "",
        bio: existingTrainer.bio || "",
        gym_id: existingTrainer.gym_id?.toString() || ""
      });
    }
  }, [existingTrainer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const gymIdToUse =
      formData.gym_id || localStorage.getItem("gym_id");

    if (!formData.email) {
      setErrors({ email: "Email is required" });
      setLoading(false);
      return;
    }

    const payload = {
      email: formData.email,
      bio: formData.bio || "",
      gym_id: parseInt(gymIdToUse, 10)
    };

    try {
      if (existingTrainer) {
        await onUpdate(existingTrainer.id, payload);
      } else {
        await onCreate(payload); // invite-based creation
      }
      onSuccess();
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Failed to save trainer"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="trainer-form-modal">
        <div className="modal-header">
          <h2>{existingTrainer ? "Edit Trainer" : "Invite Trainer"}</h2>
          <button onClick={onCancel}><X /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email *</label>
          <input name="email" value={formData.email} onChange={handleChange} disabled={!!existingTrainer} />
          {errors.email && <span>{errors.email}</span>}

          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />

          <label>Gym ID</label>
          <input name="gym_id" type="number" value={formData.gym_id} onChange={handleChange} placeholder="Leave empty to use your gym" />

          {errors.general && <p>{errors.general}</p>}

          <button type="submit" disabled={loading}>
            {existingTrainer ? "Update Trainer" : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;
