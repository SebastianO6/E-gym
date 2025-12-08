import React, { useState, useMemo } from "react";
import styles from "./TrainersList.module.css";
import { useNavigate } from "react-router-dom";

// MOCK
const MOCK = [
  { id:1, name:"Mike Johnson", email:"mike@test.com", active:true },
  { id:2, name:"Lisa Wong", email:"lisa@test.com", active:false }
];

export default function TrainersList(){
  const [search,setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(()=> MOCK.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())),[search]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Trainers</h1>
        <input placeholder="Search trainers" value={search} onChange={e=>setSearch(e.target.value)} className={styles.search}/>
      </div>

      <div className={styles.list}>
        {filtered.map(t=>(
          <div key={t.id} className={styles.item}>
            <div>
              <div className={styles.name}>{t.name}</div>
              <div className={styles.email}>{t.email}</div>
            </div>
            <div>
              <button onClick={()=>navigate(`/gymadmin/trainers/${t.id}`)} className={styles.view}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
