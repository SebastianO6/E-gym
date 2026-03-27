// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAuth, getCurrentUser, clearAuth, getAuthToken } from "../utils/authLocal";
import { connectSocket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize auth state
  const [auth, setAuthState] = useState(() => {
    const user = getCurrentUser();
    const token = getAuthToken();
    const mustChangePassword = localStorage.getItem("egym_must_change_password") === "true";

    return token && user
      ? { accessToken: token, user, mustChangePassword }
      : null;
  });

  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ LOGOUT wrapped in useCallback for stable reference
  const logout = useCallback(() => {
    clearAuth();
    localStorage.removeItem("egym_must_change_password");
    setAuthState(null);
    navigate("/login");
  }, [navigate]);

  // Initialization effect
  useEffect(() => setInitialized(true), []);

  // Auto-connect socket when authenticated
  useEffect(() => {
    if (auth?.accessToken && !auth?.mustChangePassword) {
      connectSocket(auth.accessToken);
    }
  }, [auth?.accessToken, auth?.mustChangePassword]);

  // Validate session every 15s
  useEffect(() => {
    const validateSession = async () => {
      if (!auth?.accessToken || auth?.mustChangePassword) return;
      try {
        await api.get("/auth/me");
      } catch (err) {
        console.warn("Session invalid:", err.response?.data);
        if ([401, 403].includes(err.response?.status)) {
          logout();
        }
      }
    };

    validateSession();
    const interval = setInterval(validateSession, 15000);
    return () => clearInterval(interval);
  }, [auth?.accessToken, auth?.mustChangePassword, logout]); // ✅ added missing deps

  /* -------------------- LOGIN -------------------- */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      if (data.must_change_password) {
        localStorage.setItem("egym_temp_token", data.temp_token);
        localStorage.setItem("egym_must_change_password", "true");

        setAuthState({
          accessToken: data.temp_token,
          user: data.user,
          mustChangePassword: true,
        });

        navigate("/force-password-change");
        return;
      }

      setAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      });

      localStorage.setItem("egym_must_change_password", "false");

      setAuthState({
        accessToken: data.access_token,
        user: data.user,
        mustChangePassword: false,
      });

      redirectByRole(data.user.role);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FORCE PASSWORD CHANGE ---------------- */
  const forceChangePassword = async (newPassword) => {
    setLoading(true);
    try {
      const res = await api.put("/auth/force-change-password", {
        new_password: newPassword,
      });

      setAuth({
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        user: res.data.user,
      });

      localStorage.removeItem("egym_temp_token");
      localStorage.setItem("egym_must_change_password", "false");

      setAuthState({
        accessToken: res.data.access_token,
        user: res.data.user,
        mustChangePassword: false,
      });

      redirectByRole(res.data.user.role);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Failed to change password" };
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  // Already wrapped in useCallback above

  /* ---------------- HELPERS ---------------- */
  const redirectByRole = (role = "client") => {
    if (role === "superadmin") navigate("/superadmin");
    else if (role === "gymadmin") navigate("/gymadmin");
    else if (role === "trainer") navigate("/trainer");
    else navigate("/client");
  };

  const isAuthenticated = Boolean(auth?.accessToken);
  const requiresPasswordChange = auth?.mustChangePassword === true;

  return (
    <AuthContext.Provider
      value={{
        auth,
        initialized,
        setAuth: setAuthState,
        login,
        logout,
        forceChangePassword,
        changePassword: async (currentPassword, newPassword) => {
          setLoading(true);
          try {
            await api.put("/auth/change-password", { current_password: currentPassword, new_password: newPassword });
            return { success: true };
          } catch (err) {
            return { success: false, error: err.response?.data?.error || "Failed to change password" };
          } finally {
            setLoading(false);
          }
        },
        isAuthenticated,
        requiresPasswordChange,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
