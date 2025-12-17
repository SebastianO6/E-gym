import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainerMembers.module.css";
import { Search } from "lucide-react";

// Mock members
const MOCK_MEMBERS = [
  { id: 1, name: "Alex Johnson", age: 28, goal: "Weight Loss" },
  { id: 2, name: "Maria Gomez", age: 31, goal: "Muscle Gain" },
  { id: 3, name: "David Lee", age: 22, goal: "Endurance" },
  { id: 4, name: "Sarah Connor", age: 35, goal: "Conditioning" },
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
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search members by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map(m => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className={styles.avatar}>
                    {m.name.charAt(0)}
                </div>
                <div className={styles.cardInfo}>
                    <h3>{m.name}</h3>
                    <p className={styles.cardMeta}>{m.age} years old</p>
                </div>
              </div>
            </div>
            
            <div className={styles.goals}>
                <span className={styles.tag}>{m.goal}</span>
            </div>

            <div className={styles.actions}>
              <button onClick={() => navigate(`/trainer/members/${m.id}`)} className={`${styles.btn} ${styles.view}`}>View Profile</button>
              <button onClick={() => navigate(`/trainer/plans/create?member=${m.id}`)} className={`${styles.btn} ${styles.plan}`}>Create Plan</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerMembers;