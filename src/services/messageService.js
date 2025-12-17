// src/services/messageService.js
import api from "../api/axios";

export function sendMessage(payload) {
  return api.post("/messages/send", payload).then((res) => res.data);
}

export function inbox() {
  return api.get("/messages/inbox").then((res) => res.data);
}

export function sent() {
  return api.get("/messages/sent").then((res) => res.data);
}

export function getConversation(partnerId) {
  return api
    .get(`/messages/conversation/${partnerId}`)
    .then((res) => res.data);
}
