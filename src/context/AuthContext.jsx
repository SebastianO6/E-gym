// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  getAuthLocal,
  setAuthLocal,
  clearAuth,
} from "./authLocal";
import { connectSocket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // hydrate auth from localStorage
  const [auth, setAuth] = useState(() => getAuthLocal());
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     Sync auth state if localStorage changes (multi-tab)
  ---------------------------------------------------- */
  useEffect(() => {
    const onStorage = () => {
      setAuth(getAuthLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ----------------------------------------------------
     Auto-connect socket when authenticated
  ---------------------------------------------------- */
  useEffect(() => {
    if (auth?.accessToken) {
      connectSocket();
    }
  }, [auth?.accessToken]);

  /* ----------------------------------------------------
     LOGIN
  ---------------------------------------------------- */
  const login = async ({ email, password }) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      const payload = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        user: data.user,
      };

      setAuthLocal(payload);
      setAuth(payload);

      redirectByRole(data.user?.role);
    } catch (err) {
      /**
       * DEV FALLBACK (only if backend unreachable)
       * Keeps your current DX intact
       */
      if (!err.response) {
        const mockRole =
          email.includes("super") ? "superadmin" :
          email.includes("gym") ? "gymadmin" :
          email.includes("train") ? "trainer" :
          "client";

        const payload = {
          accessToken: "MOCK_TOKEN",
          refreshToken: "MOCK_REFRESH",
          user: {
            id: "mock-1",
            email,
            role: mockRole,
          },
        };

        setAuthLocal(payload);
        setAuth(payload);
        redirectByRole(mockRole);
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------
     LOGOUT
  ---------------------------------------------------- */
  const logout = () => {
    clearAuth();
    setAuth(null);
    navigate("/login");
  };

  /* ----------------------------------------------------
     HELPERS
  ---------------------------------------------------- */
  const redirectByRole = (role = "client") => {
    if (role === "superadmin") navigate("/superadmin");
    else if (role === "gymadmin") navigate("/gymadmin");
    else if (role === "trainer") navigate("/trainer");
    else navigate("/client");
  };

  const isAuthenticated = Boolean(auth?.accessToken);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
