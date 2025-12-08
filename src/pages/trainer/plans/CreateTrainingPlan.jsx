import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./CreateTrainingPlan.module.css";

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
    console.log("SAVE PLAN (TODO API):", payload);
    // TODO: api.post('/trainer/plans', payload)
    alert("Plan saved (mock)");
    navigate(`/trainer/members/${memberId}`);
  };

  return (
    <div className={styles.container}>
      <h1>Create Training Plan</h1>
      <label>Plan Name</label>
      <input className={styles.input} value={planName} onChange={(e)=>setPlanName(e.target.value)} placeholder="e.g. Strength 8-week" />

      <div className={styles.days}>
        {DAYS.map(d=>(
          <button key={d} onClick={()=>setSelectedDay(d)} className={`${styles.day} ${selectedDay===d ? styles.active : ''}`}>{d}</button>
        ))}
      </div>

      <h3>{selectedDay} Exercises</h3>
      <button className={styles.add} onClick={addExercise}>+ Add Exercise</button>

      <div className={styles.list}>
        {(exercises[selectedDay] || []).map(ex=>(
          <div key={ex.id} className={styles.card}>
            <input value={ex.name} placeholder="Exercise" onChange={(e)=>update(selectedDay,ex.id,'name',e.target.value)} className={styles.small} />
            <input value={ex.sets} placeholder="Sets" onChange={(e)=>update(selectedDay,ex.id,'sets',e.target.value)} className={styles.tiny} />
            <input value={ex.reps} placeholder="Reps" onChange={(e)=>update(selectedDay,ex.id,'reps',e.target.value)} className={styles.tiny} />
            <input value={ex.rest} placeholder="Rest (sec)" onChange={(e)=>update(selectedDay,ex.id,'rest',e.target.value)} className={styles.tiny}/>
          </div>
        ))}
      </div>

      <label>Notes</label>
      <textarea className={styles.textarea} value={notes} onChange={(e)=>setNotes(e.target.value)} />

      <div style={{marginTop:12}}>
        <button className={styles.save} onClick={save}>Save Plan</button>
        <button className={styles.cancel} onClick={()=>navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
}
