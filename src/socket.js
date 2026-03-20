import { io } from "socket.io-client";

let socketInstance = null;
let activeToken = null;

export const connectSocket = (token) => {
  if (!token) {
    return null;
  }

  const socketUrl = (process.env.REACT_APP_SOCKET_URL || "http://localhost:5000").replace(/\/+$/, "");

  if (socketInstance && activeToken === token) {
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
  }

  activeToken = token;
  socketInstance = io(socketUrl, {
    transports: ["polling"],
    upgrade: false,
    auth: {
      token: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    activeToken = null;
  }
};
