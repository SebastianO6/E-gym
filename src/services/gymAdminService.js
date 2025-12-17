import api from "./api";

/* =========================
   TRAINERS
========================= */
export const listTrainers = () =>
  api.get("/gymadmin/trainers");

export const getTrainer = (id) =>
  api.get(`/gymadmin/trainers/${id}`);

export const createTrainer = (data) =>
  api.post("/gymadmin/trainers", data);

export const updateTrainer = (id, data) =>
  api.put(`/gymadmin/trainers/${id}`, data);

export const deleteTrainer = (id) =>
  api.delete(`/gymadmin/trainers/${id}`);

/* =========================
   MEMBERS
========================= */
export const listMembers = () =>
  api.get("/gymadmin/members");

export const getMember = (id) =>
  api.get(`/gymadmin/members/${id}`);

export const createMember = (data) =>
  api.post("/gymadmin/members", data);

export const updateMember = (id, data) =>
  api.put(`/gymadmin/members/${id}`, data);

export const deleteMember = (id) =>
  api.delete(`/gymadmin/members/${id}`);

/* =========================
   ANNOUNCEMENTS
========================= */
export const listAnnouncements = () =>
  api.get("/gymadmin/announcements");

export const createAnnouncement = (data) =>
  api.post("/gymadmin/announcements", data);

export const updateAnnouncement = (id, data) =>
  api.put(`/gymadmin/announcements/${id}`, data);

export const deleteAnnouncement = (id) =>
  api.delete(`/gymadmin/announcements/${id}`);
