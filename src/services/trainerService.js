// src/services/trainerService.js
import api from "../api/axios";

/* =============================
   MESSAGING (UNIFIED)
============================= */

export const listInbox = () =>
  api.get("/messages/inbox").then(r => r.data);

export const listSent = () =>
  api.get("/messages/sent").then(r => r.data);

export const getConversation = (userId) =>
  api.get(`/messages/conversation/${userId}`).then(r => r.data);

export const sendMessage = (data) =>
  api.post("/messages/send", {
    receiver_id: Number(data.receiver_id),
    content: data.content,
  });




/* =============================
   TRAINER PLANS (UNCHANGED)
============================= */

export const createTrainingPlan = (data) =>
  api.post("/trainer/plans", data);

export const getPlansForMember = (memberId) =>
  api.get(`/trainer/plans/member/${memberId}`);
