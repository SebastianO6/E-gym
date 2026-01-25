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


