import api from "../api/axios";

/* =========================
   TRAINERS
========================= */
export const listTrainers = async (params = {}) => {
  const res = await api.get("/gymadmin/trainers", { params });
  return res.data.items;
};

export const getTrainer = async (trainerId) => {
  const res = await api.get(`/gymadmin/trainers/${trainerId}`);
  return res.data;
};


export const updateTrainer = async (id, data) => {
  const res = await api.put(`/gymadmin/trainers/${id}`, data);
  return res.data;
};

export const deactivateTrainer = async (id) => {
  const res = await api.patch(`/gymadmin/trainers/${id}/deactivate`);
  return res.data;
};

export const activateTrainer = async (id) => {
  const res = await api.patch(`/gymadmin/trainers/${id}/activate`);
  return res.data;
};


export const inviteTrainer = async (formData) => {
  return api.post("/gymadmin/trainers/invite", {
    email: formData.email,
    first_name: formData.first_name,
    last_name: formData.last_name,
    phone: formData.phone,
  });
};

export const resendInvite = async (inviteId) => {
  const res = await api.post(`/gymadmin/invites/${inviteId}/resend`);
  return res.data;
};

/* =========================
   MEMBERS
========================= */
export const listMembers = async () => {
  const res = await api.get("/gymadmin/members");
  return res.data.items;
};

export const getMember = async (id) => {
  const res = await api.get(`/gymadmin/members/${id}`);
  return res.data;
};

export const updateMember = async (id, data) => {
  const res = await api.put(`/gymadmin/members/${id}`, data);
  return res.data;
};

export const inviteMember = async (payload) => {
  const res = await api.post("/gymadmin/members/invite", payload);
  return res.data;
};

export const deactivateMember = async (id) => {
  const res = await api.patch(`/gymadmin/members/${id}/deactivate`);
  return res.data;
};

export const activateMember = async (id) => {
  const res = await api.patch(`/gymadmin/members/${id}/activate`);
  return res.data;
};

export const deleteMember = async (id) => {
  const res = await api.delete(`/gymadmin/members/${id}`);
  return res.data;
};

export const getExpiredMembers = async () => {
  const res = await api.get("/gymadmin/members/expired");
  return res.data.items;
};

export const deleteTrainer = async (id) => {
  const res = await api.delete(`/gymadmin/trainers/${id}`);
  return res.data;
};

/* =========================
   ASSIGN TRAINER (FIXED)
========================= */
export const assignTrainerToMember = async (memberId, trainerId) => {
  const res = await api.post(
    `/gymadmin/members/${memberId}/assign-trainer`,
    { trainer_id: trainerId }
  );
  return res.data;
};



/* =========================
   ANNOUNCEMENTS
========================= */
export const listAnnouncements = async () => {
  const res = await api.get("/gymadmin/announcements");
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
  const res = await api.get("/gymadmin/dashboard");
  return res.data;
};


export const getRevenueSummary = async () => {
  const res = await api.get("/gymadmin/revenue");
  return res.data;
};

/* =========================
   MEMBERSHIP
========================= */
export const renewMember = async (memberId, plan) => {
  const res = await api.post(`/gymadmin/members/${memberId}/renew`, { plan });
  return res.data;
};


export const getGymPricing = async () => {
  const res = await api.get("/gymadmin/pricing");
  return res.data;
};

export const setGymPricing = async (payload) => {
  const res = await api.post("/gymadmin/pricing", payload);
  return res.data;
};


export const getRevenueSeries = async () => {
  const res = await api.get("/gymadmin/revenue/series");
  return res.data;
};

export const getPlatformBilling = async () => {
  const res = await api.get("/gymadmin/platform-billing");
  return res.data;
};

export const getPlatformMemberGrowth = async () => {
  const res = await api.get("/gymadmin/platform-billing/member-growth");
  return res.data;
};


export const getMemberPayments = async (memberId) => {
  const res = await api.get(`/gymadmin/members/${memberId}/payments`);
  return res.data;
};

