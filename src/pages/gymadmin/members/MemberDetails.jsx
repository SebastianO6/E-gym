import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMember,
  listTrainers,
  assignTrainerToMember,
} from "../../../services/gymAdminService";
import styles from "./MemberDetails.module.css"

const MemberDetails = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [trainerId, setTrainerId] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const memberData = await getMember(memberId);
    const trainersData = await listTrainers();

    setMember(memberData);
    setTrainers(trainersData);
    setTrainerId(memberData.trainer_id || "");
  };

  const assignTrainer = async () => {
    if (!trainerId) return;
    await assignTrainerToMember(memberId, trainerId);
    alert("Trainer assigned successfully");
    load();
  };

  if (!member) return <p>Loading...</p>;

  return (
    <div>
      <h2>Member Details</h2>

      <p><b>Email:</b> {member.email}</p>
      <p><b>Plan:</b> {member.plan}</p>
      <p><b>Status:</b> {member.status}</p>

      <hr />

      <h3>Assign Trainer</h3>

      <select
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
      >
        <option value="">-- Select Trainer --</option>
        {trainers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.email}
          </option>
        ))}
      </select>

      <button onClick={assignTrainer} style={{ marginLeft: 8 }}>
        Assign
      </button>
    </div>
  );
};

export default MemberDetails;
