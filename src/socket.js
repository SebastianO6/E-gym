// import { io } from "socket.io-client";
// import { getAuthToken } from "./context/authLocal";

// let socket = null;

// export const connectSocket = () => {
//   const token = getAuthToken();
//   if (!token) return;

//   if (!socket) {
//     socket = io("http://localhost:5000", {
//       auth: {
//         token: `Bearer ${token}`,
//       },
//       transports: ["websocket"],
//     });
//   }

//   if (!socket.connected) {
//     socket.connect();
//   }
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

// export default () => socket;


// TEMP disable socket until backend stable
export const connectSocket = () => {};
export const disconnectSocket = () => {};
export default null;
