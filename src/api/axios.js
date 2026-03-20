import axios from "axios";
import { getAuthToken, clearAuth } from "../utils/authLocal";

const apiBaseUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if ([401, 403, 422].includes(err.response?.status)) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
