import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MessagesList.module.css";

const mockChats = [
  {
    memberId: 101,
    name: "John Doe",
    lastMessage: "Thanks for the workout plan!",
    time: "2h ago"
  },
  {
    memberId: 102,
    name: "Sarah Smith",
    lastMessage: "Can we adjust Monday routine?",
    time: "5h ago"
  },
  {
    memberId: 103,
    name: "Mark Johnson",
    lastMessage: "Completed today's session!",
    time: "1d ago"
  }
];

export default function MessagesList() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Messages</h1>
      <p className={styles.subtitle}>Conversations with your assigned clients</p>

      <div className={styles.list}>
        {mockChats.map(chat => (
          <div
            key={chat.memberId}
            className={styles.chatItem}
            onClick={() => navigate(`/trainer/messages/${chat.memberId}`)}
          >
            <div className={styles.avatar}>{chat.name.charAt(0)}</div>

            <div className={styles.info}>
              <h3 className={styles.name}>{chat.name}</h3>
              <p className={styles.lastMessage}>{chat.lastMessage}</p>
            </div>

            <span className={styles.time}>{chat.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
