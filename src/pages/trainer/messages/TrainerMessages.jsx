import React, { useEffect, useState } from "react";
// import socket from "../../../socket"; // Mocking socket for UI demo
// import { listInbox, listSent, getConversation, sendMessage } from "../../../services/trainerService";
import styles from "./TrainerMessages.module.css";
import { Send, User } from "lucide-react";

// Mock Data
const MOCK_INBOX = [
  { id: 1, sender_id: 101, sender_name: "Alex Johnson", content: "Hey coach, running late today!" },
  { id: 2, sender_id: 102, sender_name: "Maria Gomez", content: "Is the leg day plan updated?" }
];

const MOCK_MESSAGES = {
  101: [
    { id: 1, sender_id: 101, sender_name: "Alex Johnson", content: "Hey coach, running late today!" },
    { id: 2, sender_id: 999, sender_name: "Me", content: "No worries Alex, take your time." }
  ],
  102: [
    { id: 1, sender_id: 102, sender_name: "Maria Gomez", content: "Is the leg day plan updated?" }
  ]
};

export default function TrainerMessages() {
  const [inbox, setInbox] = useState(MOCK_INBOX);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conv, setConv] = useState([]);
  const [text, setText] = useState("");

  const myId = 999; // Mock ID

  useEffect(() => {
    // In real app, socket listener would go here
  }, []);

  const openConversation = (userId) => {
    setSelectedUser(userId);
    setConv(MOCK_MESSAGES[userId] || []);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedUser || !text.trim()) return;

    // Mock send
    const newMsg = { id: Date.now(), sender_id: myId, sender_name: "Me", content: text.trim() };
    setConv([...conv, newMsg]);
    setText("");
  };

  const getSelectedUserName = () => {
    const user = inbox.find(u => u.sender_id === selectedUser);
    return user ? user.sender_name : "Chat";
  };

  return (
    <div className={styles.container}>
      {/* LEFT SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Messages</h3>
        </div>
        <div className={styles.userList}>
          {inbox.map(m => (
            <div
              key={m.id}
              onClick={() => openConversation(m.sender_id)}
              className={`${styles.userItem} ${selectedUser === m.sender_id ? styles.activeItem : ''}`}
            >
              <span className={styles.userName}>{m.sender_name}</span>
              <span className={styles.preview}>{m.content}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CHAT AREA */}
      <main className={styles.chatArea}>
        <div className={styles.chatHeader}>
          {selectedUser ? (
             <>
               <User size={20} className="text-gray-500" />
               {getSelectedUserName()}
             </>
          ) : "Select a conversation"}
        </div>

        {!selectedUser ? (
          <div className={styles.emptyState}>
            <p>Select a contact to view messages</p>
          </div>
        ) : (
          <>
            <div className={styles.messagesList}>
              {conv.map(m => (
                <div 
                  key={m.id} 
                  className={`${styles.messageBubble} ${m.sender_id === myId ? styles.msgMe : styles.msgThem}`}
                >
                  <div className={styles.senderName}>{m.sender_id === myId ? "You" : m.sender_name}</div>
                  {m.content}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className={styles.inputArea}>
              <textarea
                className={styles.textarea}
                value={text}
                onChange={e => setText(e.target.value)}
                rows={1}
                placeholder="Type a message..."
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={18} />
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}