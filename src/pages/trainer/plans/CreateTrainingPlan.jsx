import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import styles from "./CreateTrainingPlan.module.css";
import { Plus, Save, Calendar } from "lucide-react";
import api from "../../../api/axios";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function CreateTrainingPlan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const memberId = searchParams.get("member");
  const clientIdFromURL = new URLSearchParams(location.search).get("client_id");

  const [planName, setPlanName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [exercises, setExercises] = useState({});
  const [notes, setNotes] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(memberId || clientIdFromURL || "");

  useEffect(() => {
    if (!memberId) {
      api.get("/trainer/members")
        .then(res => setClients(Array.isArray(res.data) ? res.data : res.data.items || []))
        .catch(() => setClients([]));
    }
  }, [memberId]);

  const addExercise = () => {
    const newExercise = {
      id: Date.now(),
      name: "",
      sets: "",
      reps: "",
      rest: ""
    };

    setExercises(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay]
        ? [...prev[selectedDay], newExercise]
        : [newExercise]
    }));
  };

  const updateExercise = (day, id, field, value) => {
    setExercises(prev => ({
      ...prev,
      [day]: prev[day].map(ex =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const savePlan = async () => {
    if (!planName || !selectedClient) {
      alert("Missing required fields");
      return;
    }

    try {
      const res = await api.post("/trainer/workout-plans", {
        title: planName,
        client_id: Number(selectedClient),
        description: notes,
        schedule: exercises
      });

      const created = res.data;

      if (window.confirm("Plan created. Schedule first session now?")) {
        navigate(`/trainer/schedule?plan_id=${created.id}&client_id=${selectedClient}`);
      } else {
        navigate(`/trainer/members/${selectedClient}`);
      }

    } catch (err) {
      alert("Failed to create plan");
    }
  };

  return (
    <div className={`{styles.container} ${selectedClient ? styles.chatOpen : ""}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Training Plan</h1>
      </div>  

      <div className={styles.mainForm}>

        <div>
          <label className={styles.label}>Plan Name</label>
          <input
            className={styles.input}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="Strength Phase 1 - 8 Weeks"
          />
        </div>

        {!memberId && (
          <div>
            <label className={styles.label}>Select Client</label>
            <select
              className={styles.input}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Choose a client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={styles.label}>Schedule</label>
          <div className={styles.tabs}>
            {DAYS.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`${styles.tab} ${selectedDay === day ? styles.tabActive : ""}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.exerciseSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.dayTitle}>
              <Calendar size={16} style={{ marginRight: 6 }} />
              {selectedDay} Workout
            </h3>
            <button className={styles.addBtn} onClick={addExercise}>
              <Plus size={14} /> Add Exercise
            </button>
          </div>

          <div className={styles.exerciseList}>
            {(exercises[selectedDay] || []).map(ex => (
              <div key={ex.id} className={styles.exerciseCard}>
                <input
                  className={styles.inputSmall}
                  placeholder="Exercise Name"
                  value={ex.name}
                  onChange={(e) => updateExercise(selectedDay, ex.id, "name", e.target.value)}
                />
                <input
                  className={styles.inputSmall}
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => updateExercise(selectedDay, ex.id, "sets", e.target.value)}
                />
                <input
                  className={styles.inputSmall}
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => updateExercise(selectedDay, ex.id, "reps", e.target.value)}
                />
                <input
                  className={styles.inputSmall}
                  placeholder="Rest (s)"
                  value={ex.rest}
                  onChange={(e) => updateExercise(selectedDay, ex.id, "rest", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={styles.label}>Coach Notes</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.cancel}`} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className={`${styles.btn} ${styles.save}`} onClick={savePlan}>
            <Save size={16} style={{ marginRight: 6 }} />
            Save Plan
          </button>
        </div>

      </div>
    </div>
  );
}