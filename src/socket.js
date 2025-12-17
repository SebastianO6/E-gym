import { io } from "socket.io-client";
import { getAuthToken } from "./context/authLocal";

const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export const connectSocket = () => {
  const token = getAuthToken();
  if (!token) return;

  socket.auth = {
    token: `Bearer ${token}`,
  };

  socket.connect();
};

export default socket;
