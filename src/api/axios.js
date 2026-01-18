// src/api/axios.js - FIXED VERSION
import axios from "axios";
import { getAuthToken, clearAuth } from "../utils/authLocal"; // ✅ Use utils version

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

/* ------------------------------
   REQUEST: attach JWT
------------------------------ */
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios adding token to request:", token.substring(0, 20) + "...");
    } else {
      console.warn("No auth token found for axios request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------
   RESPONSE: handle 401 globally
------------------------------ */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;