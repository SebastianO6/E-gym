// src/services/clientService.js
import api from "../api/axios";

export async function getMyPlan() {
  const res = await api.get("/client/plans");
  return res.data;
}

export async function getAnnouncements() {
  const res = await api.get("/client/announcements");
  return res.data;
}

export const sendClientMessage = (data) =>
  api.post("/messages/send", {
    receiver_id: Number(data.receiver_id),
    text: data.text,
  }).then(r => r.data);

export const mySentMessages = () =>
  api.get("/messages/sent").then(r => r.data);

