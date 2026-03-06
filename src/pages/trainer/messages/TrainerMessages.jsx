import React, { useEffect, useState, useRef } from "react";
import styles from "./TrainerMessages.module.css";
import { Send, Trash2 } from "lucide-react";
import api from "../../../api/axios";
import { connectSocket } from "../../../socket";
import { getAuthToken } from "../../../utils/authLocal";

export default function TrainerMessages() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [trainerId, setTrainerId] = useState(null);

  const [showChatMobile, setShowChatMobile] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const token = getAuthToken();
      if (!token) return;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = parseInt(decoded.sub);
      setTrainerId(userId);

      const res = await api.get("/trainer/chat/members");
      setClients(res.data || []);

      const socket = connectSocket(token);
      socketRef.current = socket;

      socket.on("new_message", (msg) => {
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
      });
    };

    init();
    return () => socketRef.current?.disconnect();
  }, []);

  const openConversation = async (client) => {
    setSelectedClient(client);
    setShowChatMobile(true);

    const res = await api.get(`/trainer/chat/${client.user_id}`);

    const formatted = (res.data.items || []).map((m) => ({
      ...m,
      is_mine: m.sender_id === trainerId,
    }));

    setMessages(formatted);

    socketRef.current?.emit("join_room", {
      receiver_id: client.user_id,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedClient) return;

    socketRef.current.emit("send_message", {
      receiver_id: selectedClient.user_id,
      content: text.trim(),
    });

    setText("");
  };

  const deleteMessage = async (id, senderId) => {
    if (senderId !== trainerId) return;

    await api.delete(`/trainer/chat/message/${id}`);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const goBack = () => {
    setShowChatMobile(false);
    setSelectedClient(null);
  };

  return (
    <div
      className={`${styles.container} ${
        showChatMobile ? styles.mobileChatActive : ""
      }`}
    >
      {/* SIDEBAR */}

      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Your Clients</div>

        <div className={styles.userList}>
          {clients.map((client) => (
            <div
              key={client.user_id}
              className={`${styles.userItem} ${
                selectedClient?.user_id === client.user_id
                  ? styles.activeItem
                  : ""
              }`}
              onClick={() => openConversation(client)}
            >
              <div className={styles.userName}>{client.name}</div>

              <div className={styles.preview}>
                {client.last_message || "Click to view conversation"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT */}

      <div className={styles.chatArea}>
        {!selectedClient ? (
          <div className={styles.emptyState}>
            Select a client to start chatting
          </div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <button className={styles.backBtn} onClick={goBack}>
                ←
              </button>

              Chat with {selectedClient.name}
            </div>

            <div className={styles.messagesList}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.is_mine ? styles.msgMe : styles.msgThem}
                >
                  <div className={styles.messageBubble}>
                    <div>{msg.content}</div>

                    <div className={styles.messageMeta}>
                      <span>
                        {new Date(msg.created_at).toLocaleString("en-KE", {
                          timeZone: "Africa/Nairobi",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {msg.is_mine && (
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            deleteMessage(msg.id, msg.sender_id)
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={sendMessage}>
              <textarea
                className={styles.textarea}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
              />

              <button type="submit" className={styles.sendBtn}>
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}