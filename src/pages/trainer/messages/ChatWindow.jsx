import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatWindow.module.css";

const mockMessages = {
  101: [
    { from: "member", text: "Hi coach!", time: "10:22 AM" },
    { from: "trainer", text: "Hey John, how can I help?", time: "10:25 AM" }
  ]
};

export default function ChatWindow() {
  const { memberId } = useParams();
  const [messages, setMessages] = useState(mockMessages[memberId] || []);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      from: "trainer",
      text: input,
      time: "Now"
    };

    setMessages(prev => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Chat with Member #{memberId}</div>

      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.from === "trainer" ? styles.mine : styles.theirs
            }`}
          >
            {msg.text}
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className={styles.sendBtn} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
