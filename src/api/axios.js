import axios from "axios";
import { getAuthToken, clearAuth } from "../utils/authLocal";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

/* ------------------------------
   REQUEST: attach JWT
------------------------------ */
api.interceptors.request.use(
  (config) => {
    const mustChange = localStorage.getItem("egym_must_change_password") === "true";

    // 🔐 FORCE PASSWORD CHANGE MODE
    if (mustChange) {
      const tempToken = localStorage.getItem("egym_temp_token");

      // Only allow force-change endpoint
      if (config.url.includes("/auth/force-change-password")) {
        config.headers.Authorization = `Bearer ${tempToken}`;
      }

      return config; // block everything else
    }

    // 🔓 NORMAL MODE
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------------------------
   RESPONSE: auth failures
------------------------------ */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // 🔒 Invalid / expired / malformed JWT
    if (status === 401 || status === 422) {
      clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;
