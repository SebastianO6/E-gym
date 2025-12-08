import React, { useState } from "react";
import styles from "./ChatWindow.module.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { from: "trainer", text: "Welcome to your new plan! 💪" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "client", text: input }]);
    setInput("");
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.messages}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.msg} ${m.from === "client" ? styles.client : styles.trainer}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
