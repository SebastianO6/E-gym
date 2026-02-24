// src/services/messageService.js
import api from "../api/axios";

export function getConversation(partnerId) {
  return api.get(`/messages/conversation/${partnerId}`)
    .then(res => res.data);
}
