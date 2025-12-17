import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./CreateTrainingPlan.module.css";
import { Plus, Save, X, Calendar } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function CreateTrainingPlan() {
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get("member");
  const navigate = useNavigate();

  const [planName, setPlanName] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [exercises, setExercises] = useState({});
  const [notes, setNotes] = useState("");

  const addExercise = () => {
    const ex = { id: Date.now(), name:"", sets:"", reps:"", rest:"" };
    setExercises(prev => ({ ...prev, [selectedDay]: prev[selectedDay] ? [...prev[selectedDay], ex] : [ex] }));
  };

  const update = (day,id,field,value) => {
    setExercises(prev => ({ ...prev, [day]: prev[day].map(e => e.id===id ? {...e,[field]:value} : e) }));
  };

  const save = () => {
    const payload = { memberId, planName, notes, days: exercises };
    console.log("SAVE PLAN:", payload);
    alert("Training plan saved successfully!");
    navigate(`/trainer/members/${memberId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Training Plan</h1>
      </div>

      <div className={styles.mainForm}>
        <div>
          <label className={styles.label}>Plan Name</label>
          <input 
            className={styles.input} 
            value={planName} 
            onChange={(e)=>setPlanName(e.target.value)} 
            placeholder="e.g. Strength Phase 1 - 8 Weeks" 
          />
        </div>

        {/* Day Tabs */}
        <div>
          <label className={styles.label}>Schedule</label>
          <div className={styles.tabs}>
            {DAYS.map(d=>(
              <button 
                key={d} 
                onClick={()=>setSelectedDay(d)} 
                className={`${styles.tab} ${selectedDay===d ? styles.tabActive : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Editor */}
        <div className={styles.exerciseSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.dayTitle}><Calendar size={16} style={{display:'inline', marginRight:6}}/> {selectedDay} Workout</h3>
            <button className={styles.addBtn} onClick={addExercise}>
              <Plus size={14} /> Add Exercise
            </button>
          </div>

          <div className={styles.exerciseList}>
            {(!exercises[selectedDay] || exercises[selectedDay].length === 0) && (
              <p style={{color:'var(--text-light)', fontSize:14, textAlign:'center', fontStyle:'italic'}}>No exercises added for {selectedDay}.</p>
            )}
            {(exercises[selectedDay] || []).map(ex=>(
              <div key={ex.id} className={styles.exerciseCard}>
                <input 
                  value={ex.name} 
                  placeholder="Exercise Name" 
                  onChange={(e)=>update(selectedDay,ex.id,'name',e.target.value)} 
                  className={styles.inputSmall} 
                />
                <input 
                  value={ex.sets} 
                  placeholder="Sets" 
                  onChange={(e)=>update(selectedDay,ex.id,'sets',e.target.value)} 
                  className={styles.inputSmall} 
                />
                <input 
                  value={ex.reps} 
                  placeholder="Reps" 
                  onChange={(e)=>update(selectedDay,ex.id,'reps',e.target.value)} 
                  className={styles.inputSmall} 
                />
                <input 
                  value={ex.rest} 
                  placeholder="Rest (s)" 
                  onChange={(e)=>update(selectedDay,ex.id,'rest',e.target.value)} 
                  className={styles.inputSmall}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={styles.label}>Coach Notes</label>
          <textarea 
            className={styles.textarea} 
            value={notes} 
            onChange={(e)=>setNotes(e.target.value)} 
            rows={4}
            placeholder="Instructions, focus points, or cardio assignments..."
          />
        </div>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.cancel}`} onClick={()=>navigate(-1)}>Cancel</button>
          <button className={`${styles.btn} ${styles.save}`} onClick={save}>
            <Save size={16} style={{display:'inline', marginRight:6}}/>
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}