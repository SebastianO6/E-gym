import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function ScheduleDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/schedules/trainer/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load schedule detail", err);
      }
    };
    load();
  }, [id]);

  if (!data) return <div style={{ padding: 24 }}>Loading...</div>;

  const schedule = data.schedule || {};

  const orderedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
        }}
      >
        <h2 style={{ marginBottom: 4 }}>
          {data.plan_title || "Training Session"}
        </h2>

        <p style={{ color: "#777", marginBottom: 20 }}>
          Client: {data.client_name}
        </p>

        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: 20,
            background:
              data.status === "completed"
                ? "#d4edda"
                : "#e2e3ff",
            color:
              data.status === "completed"
                ? "#155724"
                : "#383d7c",
            fontSize: 14,
            marginBottom: 30
          }}
        >
          {data.status}
        </div>

        {Object.keys(schedule).length === 0 && (
          <p style={{ fontStyle: "italic" }}>
            No exercises assigned to this plan.
          </p>
        )}

        {orderedDays
          .filter(day => schedule[day])
          .map(day => {
            const exercises = schedule[day];

            return (
              <div key={day} style={{ marginBottom: 30 }}>
                <h3
                  style={{
                    borderBottom: "2px solid #f1f1f1",
                    paddingBottom: 8,
                    marginBottom: 15
                  }}
                >
                  {day}
                </h3>

                {Array.isArray(exercises) && exercises.length > 0 ? (
                  exercises.map((ex, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        background: "#f9fafc",
                        marginBottom: 8
                      }}
                    >
                      <strong>{ex.name}</strong>
                      <div style={{ fontSize: 14, color: "#666" }}>
                        {ex.sets} sets × {ex.reps} reps • Rest {ex.rest}s
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999", fontStyle: "italic" }}>
                    No exercises for this day.
                  </p>
                )}
              </div>
            );
          })}

        {data.description && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 12,
              background: "#fff8e1"
            }}
          >
            <strong>Trainer Notes</strong>
            <p style={{ marginTop: 8 }}>{data.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
