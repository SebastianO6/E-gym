import api from "../api/axios"; // your axios instance

// USERS
export const getAllUsers = async () => {
  const res = await api.get("/superadmin/users");
  return Array.isArray(res.data) ? res.data : [];
};

export const updateUserRole = async (userId, role) => {
  const res = await api.put(`/superadmin/users/${userId}/role`, { role });
  return res.data;
};

// GYMS
export const getAllGyms = async () => {
  const res = await api.get("/superadmin/gyms");
  return Array.isArray(res.data) ? res.data : [];
};


export const createGym = async (payload) => {
  const res = await api.post("/superadmin/gyms", payload);
  return res.data;
};


export const getPlatformRevenue = async () => {
  const res = await api.get("/superadmin/revenue");
  return res.data;
};


export const deleteGym = (gymId) =>
  api.delete(`/superadmin/gyms/${gymId}`);

export const getExpiringGyms = async () => {
  const res = await api.get("/superadmin/gyms/expiring");
  return res.data;
};

export const getGymSubscription = async (gymId) => {
  const res = await api.get(`/superadmin/gyms/${gymId}/subscription`);
  return res.data;
};

export const renewGymSubscription = async (gymId, plan) => {
  const res = await api.post(`/superadmin/gyms/${gymId}/renew`, {
    plan,
  });
  return res.data;
};


