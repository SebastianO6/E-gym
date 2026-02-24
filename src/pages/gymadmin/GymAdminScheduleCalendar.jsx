import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function GymAdminScheduleCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/gymadmin/schedules").then(res => {
      setEvents(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Trainer Schedule Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}
