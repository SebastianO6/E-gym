import React, { useEffect, useState, useRef } from "react";
import styles from "./ClientMessages.module.css";
import { Send, Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { connectSocket } from "../../../socket";
import { getAuthToken } from "../../../utils/authLocal";

export default function ClientMessages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [trainerId, setTrainerId] = useState(null);
  const [trainerName, setTrainerName] = useState("");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [myId, setMyId] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ===============================
  // INIT CHAT
  // ===============================
  useEffect(() => {
    const init = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const decoded = JSON.parse(atob(token.split(".")[1]));
        const userId = parseInt(decoded.sub);
        setMyId(userId);

        // Get assigned trainer
        const res = await api.get("/client/plans");
        if (!res.data.length) return;

        const plan = res.data[0];
        setTrainerId(plan.trainer_id);
        setTrainerName(plan.trainer_name);
        setTrainerEmail(plan.trainer_email);

        // Load conversation
        const convo = await api.get(`/messages/conversation/${plan.trainer_id}`);

        const formatted = (convo.data.items || []).map((m) => ({
          ...m,
          is_mine: m.sender_id === userId,
        }));

        setMessages(formatted);

        // Connect socket
        const socket = connectSocket(token);
        if (!socket) return;

        socketRef.current = socket;

        // Join room
        socket.emit("join_room", { receiver_id: plan.trainer_id });

        socket.on("new_message", (msg) => {
          if (
            msg.sender_id === plan.trainer_id ||
            msg.receiver_id === plan.trainer_id
          ) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [
                ...prev,
                {
                  ...msg,
                  is_mine: msg.sender_id === userId,
                },
              ];
            });
          }
        });

      } catch (err) {
        console.log("Client chat init failed:", err);
      }
    };

    init();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ===============================
  // SEND MESSAGE
  // ===============================
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !trainerId || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      receiver_id: trainerId,
      content: text.trim(),
    });

    setText("");
  };

  // ===============================
  // DELETE MESSAGE (CLIENT OWN ONLY)
  // ===============================
  const deleteMessage = async (id) => {
    try {
      await api.delete(`/client/chat/message/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  // ===============================
  // AUTO SCROLL
  // ===============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.chatHeader}>
        <div className={styles.avatar}>
          {trainerName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className={styles.headerName}>
            {trainerName || "Trainer"}
          </div>
          <div className={styles.headerSub}>
            {trainerEmail || "Trainer"}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className={styles.chatBox}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.messageBubble} ${
              m.is_mine ? styles.clientMsg : styles.trainerMsg
            }`}
          >
            <div>{m.content}</div>
            <div className={styles.messageMeta}>
              <small>
                {new Date(m.created_at).toLocaleTimeString("en-KE", {
                  timeZone: "Africa/Nairobi",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>

              {m.is_mine && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteMessage(m.id)}
                >
                  <Trash2 size={14} />  
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form className={styles.inputRow} onSubmit={handleSend}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}