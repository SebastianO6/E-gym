import React, { useEffect, useState } from "react";
// import { listSent, sendMessage } from "../../../services/trainerService"; // Keeps service logic intent
import styles from "./ClientMessages.module.css";
import { Send, User } from "lucide-react";

export default function ClientMessages() {
  // Merging ChatWindow logic here for a complete view
  const [messages, setMessages] = useState([
    { id: 1, from: "trainer", text: "Welcome to your new plan! 💪", time: "10:00 AM" },
    { id: 2, from: "client", text: "Thanks coach! Excited to start.", time: "10:05 AM" }
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock loading
  useEffect(() => {
     // In real app: listSent()...
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Simulate optimistic update
    const newMsg = { id: Date.now(), from: "client", text: text, time: "Just now" };
    setMessages([...messages, newMsg]);
    setText("");

    // In real app: sendMessage(...)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chat with Coach</h1>

      <div className={styles.chatBox}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.messageBubble} ${m.from === "client" ? styles.clientMsg : styles.trainerMsg}`}
          >
            <div className={styles.senderLabel}>{m.from === "client" ? "You" : "Coach"}</div>
            {m.text}
          </div>
        ))}
      </div>

      <form className={styles.inputRow} onSubmit={handleSend}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message to your trainer..."
          rows={1}
        />
        <button type="submit" className={styles.sendBtn}>
          <Send size={18} /> Send
        </button>
      </form>
    </div>
  );
}