// src/services/authService.js
import api from "../api/axios";
import { setAuth, clearAuth } from "../utils/authLocal";

export async function register(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post("/auth/login", payload);
  const { access_token, refresh_token, user } = res.data;

  setAuth({ access_token, refresh_token, user });

  return res.data;
}

export function logout() {
  clearAuth();
}

export async function me() {
  const res = await api.get("/auth/me");
  return res.data;
}
