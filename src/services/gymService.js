// src/services/gymService.js
import api from "../api/axios";

export async function listGyms() {
  const res = await api.get("/gyms");
  return res.data;
}

export async function getGym(gymId) {
  const res = await api.get(`/gyms/${gymId}`);
  return res.data;
}

export async function createGym(payload) {
  const res = await api.post("/gyms", payload);
  return res.data;
}

export async function updateGym(gymId, payload) {
  const res = await api.put(`/gyms/${gymId}`, payload);
  return res.data;
}

export async function deleteGym(gymId) {
  const res = await api.delete(`/gyms/${gymId}`);
  return res.data;
}
