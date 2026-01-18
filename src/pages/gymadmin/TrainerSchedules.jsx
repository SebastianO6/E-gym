import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./TrainerSchedules.module.css";

const TrainerSchedules = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    trainer_id: "all",
    status: "all",
    date: new Date().toISOString().split('T')[0]
  });
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load trainers
      const trainersRes = await api.get("/gymadmin/trainers?per_page=100");
      setTrainers(trainersRes.data?.items || []);
      
      // Load schedules with filters
      let url = "/api/schedules";
      const params = [];
      
      if (filters.trainer_id !== "all") {
        params.push(`trainer_id=${filters.trainer_id}`);
      }
      if (filters.status !== "all") {
        params.push(`status=${filters.status}`);
      }
      if (filters.date) {
        params.push(`date=${filters.date}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const schedulesRes = await api.get(url);
      setSchedules(schedulesRes.data || []);
    } catch (err) {
      console.error("Failed to load schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    
    try {
      await api.delete(`/api/schedules/${id}`);
      loadData();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      alert("Failed to delete schedule");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "#667eea",
      completed: "#43e97b",
      cancelled: "#f5576c",
      pending: "#f6d365",
      rescheduled: "#fa709a"
    };
    return colors[status] || colors.scheduled;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const getStats = () => {
    const total = schedules.length;
    const scheduled = schedules.filter(s => s.status === 'scheduled').length;
    const completed = schedules.filter(s => s.status === 'completed').length;
    const cancelled = schedules.filter(s => s.status === 'cancelled').length;
    
    return { total, scheduled, completed, cancelled };
  };

  const stats = getStats();

  return (
    <div className="schedules-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>🗓️ Training Schedules</h1>
          <p className="page-subtitle">Manage all training sessions and appointments</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate("/gymadmin/schedules/calendar")}
          >
            📅 Calendar View
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate("/gymadmin/schedules/new")}
          >
            + New Schedule
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #667eea' }}>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #43e97b' }}>
          <div className="stat-value">{stats.scheduled}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f5576c' }}>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f6d365' }}>
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <h3>🔍 Filter Schedules</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Trainer</label>
            <select
              className="filter-input"
              value={filters.trainer_id}
              onChange={(e) => setFilters({...filters, trainer_id: e.target.value})}
            >
              <option value="all">All Trainers</option>
              {trainers.map(trainer => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.email}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              className="filter-input"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date</label>
            <input
              type="date"
              className="filter-input"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
            />
          </div>
          
          <div className="filter-group">
            <label>&nbsp;</label>
            <button 
              className="btn-secondary"
              onClick={() => setFilters({
                trainer_id: "all",
                status: "all",
                date: new Date().toISOString().split('T')[0]
              })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="schedules-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No schedules found</h3>
            <p>No training sessions match your filters</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/gymadmin/schedules/new")}
            >
              + Create First Schedule
            </button>
          </div>
        ) : (
          <div className="schedules-list">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-card">
                <div 
                  className="schedule-status"
                  style={{ background: getStatusColor(schedule.status) }}
                >
                  {schedule.status.toUpperCase()}
                </div>
                
                <div className="schedule-content">
                  <div className="schedule-time">
                    <div className="time-icon">🕐</div>
                    <div>
                      <div className="time-range">
                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                      </div>
                      <div className="schedule-date">
                        {new Date(schedule.workout_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="schedule-details">
                    <div className="schedule-participants">
                      <div className="participant">
                        <span className="label">Trainer:</span>
                        <span className="value">
                          {trainers.find(t => t.id === schedule.trainer_id)?.email || `Trainer #${schedule.trainer_id}`}
                        </span>
                      </div>
                      <div className="participant">
                        <span className="label">Member:</span>
                        <span className="value">
                          {schedule.member_email || `Member #${schedule.member_id}`}
                        </span>
                      </div>
                    </div>
                    
                    {schedule.notes && (
                      <div className="schedule-notes">
                        <span className="label">Notes:</span>
                        <p>{schedule.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="schedule-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/gymadmin/schedules/${schedule.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteSchedule(schedule.id)}
                  >
                    Delete
                  </button>
                  <button 
                    className="btn-view"
                    onClick={() => alert(`Schedule Details:\n\nTrainer: ${trainers.find(t => t.id === schedule.trainer_id)?.email}\nMember: ${schedule.member_email}\nTime: ${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}\nStatus: ${schedule.status}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerSchedules;