import axios from "axios";
import { getAuthToken, clearAuth } from "../context/authLocal";

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
