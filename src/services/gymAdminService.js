import api from "../api/axios";

/* =========================
   TRAINERS
========================= */
export const listTrainers = async (params = {}) => {
  const res = await api.get("/gymadmin/trainers", { params });
  return res.data.items;
};

export const getTrainer = async (id) => {
  const res = await api.get(`/gymadmin/trainers/${id}`);
  return res.data;
};

export const createTrainer = async (data) => {
  const res = await api.post("/gymadmin/trainers", data);
  return res.data;
};

export const updateTrainer = async (id, data) => {
  const res = await api.put(`/gymadmin/trainers/${id}`, data);
  return res.data;
};

export const deleteTrainer = async (id) => {
  const res = await api.delete(`/gymadmin/trainers/${id}`);
  return res.data;
};

/* =========================
   MEMBERS
========================= */
export const listMembers = async (params = {}) => {
  const res = await api.get("/gymadmin/members", { params });
  return res.data.items;
};

export const getMember = async (id) => {
  const res = await api.get(`/gymadmin/members/${id}`);
  return res.data;
};

export const createMember = async (data) => {
  const res = await api.post("/gymadmin/members", data);
  return res.data; // Returns { message, member, initial_password }
};

export const updateMember = async (id, data) => {
  const res = await api.put(`/gymadmin/members/${id}`, data);
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await api.delete(`/gymadmin/members/${id}`);
  return res.data;
};

/* =========================
   ASSIGN TRAINER
========================= */
export const assignTrainerToMember = async (memberId, trainerId) => {
  const res = await api.put(`/gymadmin/members/${memberId}`, {
    trainer_id: trainerId,
  });
  return res.data;
};

/* =========================
   ANNOUNCEMENTS
========================= */
export const listAnnouncements = async (params = {}) => {
  const res = await api.get("/gymadmin/announcements", { params });
  return res.data;
};

export const createAnnouncement = async (data) => {
  const res = await api.post("/gymadmin/announcements", data);
  return res.data;
};

export const updateAnnouncement = async (id, data) => {
  const res = await api.put(`/gymadmin/announcements/${id}`, data);
  return res.data;
};

export const deleteAnnouncement = async (id) => {
  const res = await api.delete(`/gymadmin/announcements/${id}`);
  return res.data;
};

/* =========================
   DASHBOARD
========================= */
export const getDashboardSummary = async () => {
  const res = await api.get("/gymadmin/dashboard/summary");
  return res.data;
};

/* =========================
   GYM INFO
========================= */
export const getGymInfo = async () => {
  const res = await api.get("/gymadmin/gym/info");
  return res.data;
};

/* =========================
   MEMBERSHIP STATS
========================= */
export const getMembershipStats = async () => {
  const res = await api.get("/gymadmin/membership/stats");
  return res.data;
};

/* =========================
   TRAINER WORKLOAD
========================= */
export const getTrainerWorkload = async () => {
  const res = await api.get("/gymadmin/trainers/workload");
  return res.data;
};  