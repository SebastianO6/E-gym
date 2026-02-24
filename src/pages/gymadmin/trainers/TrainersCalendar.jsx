import { useEffect, useState } from "react";
import api from "../../../api/axios";

const TrainerCalendar = ({ trainerId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 7);

    api.get("/schedules/calendar", {
      params: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    }).then(res => {
      setEvents(res.data.filter(e => e.trainer_id === trainerId));
    });
  }, [trainerId]);

  return (
    <div>
      <h3>Upcoming Sessions</h3>

      {events.length === 0 ? (
        <p>No scheduled sessions</p>
      ) : (
        <ul>
          {events.map(e => (
            <li key={e.id}>
              {new Date(e.start).toLocaleString()} → {new Date(e.end).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrainerCalendar;
