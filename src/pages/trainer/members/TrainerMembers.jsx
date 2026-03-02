import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainerMembers.module.css";
import { Search, Calendar, MessageSquare, FileText } from "lucide-react";
import api from "../../../api/axios";

const TrainerMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/trainer/members");
      setMembers(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  // Days until subscription ends
  const daysLeft = (date) => {
    if (!date) return null;
    const today = new Date();
    const end = new Date(date);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return members;

    return members.filter((m) => {
      const firstName = (m?.first_name || "").toLowerCase();
      const lastName = (m?.last_name || "").toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      const email = (m?.email || "").toLowerCase();
      const phone = (m?.phone || "").toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
  }, [members, search]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Members</h1>
        <p>Manage and track your assigned clients</p>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading members...</p>
      ) : filteredMembers.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <div className={styles.grid}>
          {filteredMembers.map((member) => {
            const remaining = daysLeft(member.subscription_end);

            return (
              <div key={member.id} className={styles.card}>
                <div className={styles.top}>
                  <h3>
                    {member.first_name} {member.last_name}
                  </h3>
                  {remaining !== null && (
                    <span
                      className={
                        remaining <= 3
                          ? styles.expiring
                          : styles.active
                      }
                    >
                      {remaining <= 0
                        ? "Expired"
                        : `${remaining} days left`}
                    </span>
                  )}
                </div>

                <div className={styles.info}>
                  <p>{member.email}</p>
                  <p>{member.phone}</p>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() =>
                      navigate(`/trainer/members/${member.id}`)
                    }
                  >
                    <FileText size={16} />
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/trainer/plans/create?client=${member.id}`)
                    }
                  >
                    <Calendar size={16} />
                    Assign Plan
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/trainer/messages?user=${member.id}`)
                    }
                  >
                    <MessageSquare size={16} />
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainerMembers;
