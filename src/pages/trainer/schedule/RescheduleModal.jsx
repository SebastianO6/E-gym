import { useState } from "react";
import { updateSchedule } from "../../../services/trainerServiceSchedule";

const RescheduleModal = ({ session, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    workout_date: session.workout_date,
    start_time: session.start_time || "",
    end_time: session.end_time || "",
    notes: session.notes || ""
  });

  const submit = async () => {
    await updateSchedule(session.id, {
      workout_date: form.workout_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      notes: form.notes
    });

    onUpdated();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Reschedule Session</h3>

        <label>Date</label>
        <input
          type="date"
          value={form.workout_date}
          onChange={e =>
            setForm(p => ({ ...p, workout_date: e.target.value }))
          }
        />

        <label>Start Time</label>
        <input
          type="time"
          value={form.start_time}
          onChange={e =>
            setForm(p => ({ ...p, start_time: e.target.value }))
          }
        />

        <label>End Time</label>
        <input
          type="time"
          value={form.end_time}
          onChange={e =>
            setForm(p => ({ ...p, end_time: e.target.value }))
          }
        />

        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={e =>
            setForm(p => ({ ...p, notes: e.target.value }))
          }
        />

        <div className="actions">
          <button onClick={submit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
