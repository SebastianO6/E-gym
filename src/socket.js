// src/socket.js
import { io } from "socket.io-client";

export const connectSocket = (token) => {
  if (!token) {
    console.log("❌ No token provided to socket");
    return null;
  }

  const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: {
      token: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ Socket connection error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};