import React, { useState } from "react";
import styles from "./ClientMessages.module.css";
import MessageBubble from "../components/MessageBubble";

const ClientMessages = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: "trainer", text: "How is your workout going today?" },
    { id: 2, from: "client", text: "Great! Feeling stronger 💪" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { id: Date.now(), from: "client", text: input }]);
    setInput("");
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Messages with Your Trainer</h2>

      <div className={styles.chatBox}>
        {messages.map((m) => (
          <MessageBubble key={m.id} text={m.text} from={m.from} />
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className={styles.sendBtn}>
          Send
        </button>
      </div>

    </div>
  );
};

export default ClientMessages;
