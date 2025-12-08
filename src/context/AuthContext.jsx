// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";
import { getAuthLocal, setAuthLocal, clearAuth, getAuthToken } from "./authLocal";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => getAuthLocal());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // sync local -> state on mount (if changed outside)
    const onStorage = () => setAuth(getAuthLocal());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // Real call: POST /auth/login -> { access_token, refresh_token, user }
      // For now, we can call the API if backend exists; otherwise I'll show a mock fallback
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      const payload = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
      };

      setAuthLocal(payload);
      setAuth(payload);

      // redirect based on role
      const role = data.user?.role || "client";
      if (role === "superadmin") navigate("/superadmin");
      else if (role === "gymadmin") navigate("/gymadmin");
      else if (role === "trainer") navigate("/trainer");
      else navigate("/client");
    } catch (err) {
      // If backend not ready or network error, fallback to a **mock login** for dev:
      if (!err.response) {
        // mock mapping by email for quick dev:
        const mockRole =
          email.includes("super") ? "superadmin" :
          email.includes("gym") ? "gymadmin" :
          email.includes("train") ? "trainer" :
          "client";

        const payload = {
          accessToken: "MOCK_TOKEN",
          refreshToken: "MOCK_REFRESH",
          user: { id: "mock-1", email, role: mockRole },
        };
        setAuthLocal(payload);
        setAuth(payload);
        if (mockRole === "superadmin") navigate("/superadmin");
        else if (mockRole === "gymadmin") navigate("/gymadmin");
        else if (mockRole === "trainer") navigate("/trainer");
        else navigate("/client");
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // call backend logout if needed, then clear local data
    clearAuth();
    setAuth(null);
    navigate("/login");
  };

  const isAuthenticated = !!auth?.accessToken;

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
