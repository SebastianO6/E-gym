import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TrainerMessages.module.css"; // Reuse styling for consistency
import { Send, User } from "lucide-react";

// Using the same styles as TrainerMessages but in a simplified standalone view
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

  const sendMessage = (e) => {
    e.preventDefault();
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
    <div style={{ height: 'calc(100vh - 100px)', padding: 20 }}>
      <main className={styles.chatArea} style={{ height: '100%' }}>
        <div className={styles.chatHeader}>
          <User size={20} /> Chat with Member #{memberId}
        </div>

        <div className={styles.messagesList}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.messageBubble} ${
                msg.from === "trainer" ? styles.msgMe : styles.msgThem
              }`}
            >
              <div className={styles.senderName}>{msg.from === "trainer" ? "You" : "Member"} • {msg.time}</div>
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className={styles.inputArea}>
          <textarea
            className={styles.textarea}
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
          />
          <button type="submit" className={styles.sendBtn}>
            <Send size={18} />
          </button>
        </form>
      </main>
    </div>
  );
}