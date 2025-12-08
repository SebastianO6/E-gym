import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainerMembers.module.css";

// Mock members (replace with API later)
const MOCK_MEMBERS = [
  { id: 1, name: "Alex Johnson", age: 28, goal: "Weight Loss" },
  { id: 2, name: "Maria Gomez", age: 31, goal: "Muscle Gain" },
  { id: 3, name: "David Lee", age: 22, goal: "Endurance" },
];

const TrainerMembers = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return MOCK_MEMBERS.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Members</h1>
        <input
          className={styles.search}
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.list}>
        {filtered.map(m => (
          <div key={m.id} className={styles.card}>
            <div>
              <div className={styles.name}>{m.name}</div>
              <div className={styles.meta}>Age: {m.age} • Goal: {m.goal}</div>
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigate(`/trainer/members/${m.id}`)} className={styles.view}>View</button>
              <button onClick={() => navigate(`/trainer/plans/create?member=${m.id}`)} className={styles.plan}>Create Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerMembers;
