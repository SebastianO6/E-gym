import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./CreateSchedule.module.css";

const CreateSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    trainer_id: "",
    member_id: "",
    workout_date: new Date().toISOString().split('T')[0],
    start_time: "09:00",
    end_time: "10:00",
    status: "scheduled",
    notes: ""
  });

  // Data for dropdowns
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load trainers and members in parallel
      const [trainersRes, membersRes] = await Promise.all([
        api.get("/gymadmin/trainers?per_page=100"),
        api.get("/gymadmin/members?per_page=100")
      ]);

      setTrainers(trainersRes.data?.items || []);
      setMembers(membersRes.data?.items || []);
      
      // Generate time slots
      generateTimeSlots();
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load trainers and members data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMemberTrainer = useCallback(async () => {
    try {
      const response = await api.get(`/gymadmin/members/${formData.member_id}`);
      const member = response.data;
      
      if (member.trainer_id) {
        // Auto-select the member's assigned trainer
        setFormData(prev => ({
          ...prev,
          trainer_id: member.trainer_id.toString()
        }));
      }
    } catch (err) {
      console.error("Failed to load member details:", err);
    }
  }, [formData.member_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (formData.member_id) {
      loadMemberTrainer();
    }
  }, [formData.member_id, loadMemberTrainer]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    setAvailableSlots(slots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    // Validate form
    if (!formData.trainer_id || !formData.member_id || !formData.workout_date) {
      setError("Please fill in all required fields");
      setSaving(false);
      return;
    }

    // Validate time
    if (formData.start_time >= formData.end_time) {
      setError("End time must be after start time");
      setSaving(false);
      return;
    }

    try {
      const scheduleData = {
        trainer_id: parseInt(formData.trainer_id),
        member_id: parseInt(formData.member_id),
        workout_date: formData.workout_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        status: formData.status,
        notes: formData.notes
      };

      await api.post("/api/schedules", scheduleData);
      
      setSuccess("✅ Training session scheduled successfully!");
      setFormData({
        trainer_id: "",
        member_id: "",
        workout_date: new Date().toISOString().split('T')[0],
        start_time: "09:00",
        end_time: "10:00",
        status: "scheduled",
        notes: ""
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/gymadmin/schedules");
      }, 2000);

    } catch (err) {
      console.error("Failed to create schedule:", err);
      setError(err.response?.data?.error || "Failed to schedule session. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getMemberTrainerName = () => {
    if (!formData.member_id) return null;
    const member = members.find(m => m.id === parseInt(formData.member_id));
    if (!member || !member.trainer_id) return null;
    const trainer = trainers.find(t => t.id === member.trainer_id);
    return trainer ? trainer.email : null;
  };

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${formData.start_time}`);
    const end = new Date(`2000-01-01T${formData.end_time}`);
    const diff = (end - start) / (1000 * 60); // in minutes
    return diff;
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading schedule creator...</p>
      </div>
    );
  }

  return (
    <div className="create-schedule-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>📅 Schedule Training Session</h1>
          <p className="page-subtitle">Create new training sessions for members</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={() => navigate("/gymadmin/schedules")}
        >
          ← Back to Schedules
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert-error">
          ⚠ {error}
        </div>
      )}
      
      {success && (
        <div className="alert-success">
          ✅ {success}
        </div>
      )}

      <div className="schedule-form-container">
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Member Selection */}
              <div className="form-group">
                <label>Select Member *</label>
                <select
                  className="form-input"
                  value={formData.member_id}
                  onChange={(e) => setFormData({...formData, member_id: e.target.value})}
                  required
                >
                  <option value="">Choose a member</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.email} ({member.plan || 'No Plan'})
                    </option>
                  ))}
                </select>
                {getMemberTrainerName() && (
                  <div className="info-message">
                    ℹ️ This member is assigned to trainer: {getMemberTrainerName()}
                  </div>
                )}
              </div>

              {/* Trainer Selection */}
              <div className="form-group">
                <label>Select Trainer *</label>
                <select
                  className="form-input"
                  value={formData.trainer_id}
                  onChange={(e) => setFormData({...formData, trainer_id: e.target.value})}
                  required
                >
                  <option value="">Choose a trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.email} {trainer.bio ? `- ${trainer.bio.substring(0, 30)}...` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div className="form-group">
                <label>Session Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.workout_date}
                  onChange={(e) => setFormData({...formData, workout_date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <div className="date-info">
                  {new Date(formData.workout_date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>
                <div className="status-selector">
                  {['scheduled', 'confirmed', 'pending'].map(status => (
                    <button
                      key={status}
                      type="button"
                      className={`status-option ${formData.status === status ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, status})}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="time-selection">
                <div className="form-group">
                  <label>Start Time *</label>
                  <select
                    className="form-input"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    required
                  >
                    {availableSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <select
                    className="form-input"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    required
                  >
                    {availableSlots
                      .filter(time => time > formData.start_time)
                      .map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="duration-display">
                  <div className="duration-label">Duration</div>
                  <div className="duration-value">
                    {calculateDuration()} minutes ({Math.floor(calculateDuration() / 60)}h {calculateDuration() % 60}m)
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Add any special instructions, goals, or notes for this session..."
                  rows={4}
                />
              </div>

              {/* Session Summary */}
              <div className="session-summary full-width">
                <h3>📋 Session Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Member:</span>
                    <span className="summary-value">
                      {members.find(m => m.id === parseInt(formData.member_id))?.email || 'Not selected'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Trainer:</span>
                    <span className="summary-value">
                      {trainers.find(t => t.id === parseInt(formData.trainer_id))?.email || 'Not selected'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Date:</span>
                    <span className="summary-value">
                      {new Date(formData.workout_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time:</span>
                    <span className="summary-value">
                      {formData.start_time} - {formData.end_time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-small"></span>
                    Scheduling...
                  </>
                ) : (
                  "✅ Schedule Session"
                )}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate("/gymadmin/schedules")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="tips-card">
          <h3>💡 Scheduling Tips</h3>
          <ul className="tips-list">
            <li>Check trainer availability before scheduling</li>
            <li>Consider member's preferred training times</li>
            <li>Allow 15 minutes between sessions for setup</li>
            <li>Confirm with member via email/SMS</li>
            <li>Add specific goals or focus areas in notes</li>
          </ul>
        </div>
      </div>

      {/* Availability Preview */}
      <div className="availability-section">
        <h3>📊 Trainer Availability (This Week)</h3>
        <div className="availability-grid">
          {trainers.slice(0, 3).map(trainer => (
            <div key={trainer.id} className="trainer-availability">
              <div className="trainer-header">
                <div className="trainer-avatar">
                  {trainer.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="trainer-name">{trainer.email.split('@')[0]}</div>
                  <div className="trainer-sessions">5 sessions this week</div>
                </div>
              </div>
              <div className="availability-slots">
                <div className="slot available">Mon 9-11 AM</div>
                <div className="slot available">Tue 2-4 PM</div>
                <div className="slot booked">Wed 10-12 PM</div>
                <div className="slot available">Thu 3-5 PM</div>
                <div className="slot booked">Fri 11-1 PM</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;
