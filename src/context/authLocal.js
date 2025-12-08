// src/context/authLocal.js
const KEY = "gymflow_auth_v1";

export const setAuthLocal = (payload) => {
  // payload: { accessToken, refreshToken, user: { id, email, role } }
  localStorage.setItem(KEY, JSON.stringify(payload));
};

export const getAuthLocal = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const getAuthToken = () => {
  const d = getAuthLocal();
  return d?.accessToken || null;
};

export const clearAuth = () => {
  localStorage.removeItem(KEY);
};
