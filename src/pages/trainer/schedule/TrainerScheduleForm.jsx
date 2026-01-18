import React, { useState } from "react";
import { createSchedule } from "../../../services/trainerScheduleService";

export default function TrainerScheduleForm({ memberId, onDone }) {
  const [form, setForm] = useState({
    workout_date: "",
    start_time: "",
    end_time: "",
    notes: ""
  });

  const submit = async () => {
    await createSchedule({
      member_id: memberId,
      ...form
    });
    onDone?.();
  };

  return (
    <div>
      <input type="date" onChange={e => setForm(p => ({...p, workout_date: e.target.value}))} />
      <input type="time" onChange={e => setForm(p => ({...p, start_time: e.target.value}))} />
      <input type="time" onChange={e => setForm(p => ({...p, end_time: e.target.value}))} />
      <textarea placeholder="Notes"
        onChange={e => setForm(p => ({...p, notes: e.target.value}))}
      />
      <button onClick={submit}>Schedule Session</button>
    </div>
  );
}
