// src/context/AuthContext.jsx - FIXED VERSION
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAuth, getCurrentUser, clearAuth, getAuthToken } from "../utils/authLocal"; // ✅ Use utils version
import { connectSocket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Use getCurrentUser instead of getAuthLocal
  const [auth, setAuthState] = useState(() => {
    const user = getCurrentUser();
    const token = getAuthToken();
    const mustChangePassword =
      localStorage.getItem("egym_must_change_password") === "true";

    return token && user
      ? { accessToken: token, user, mustChangePassword }
      : null;
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);


  
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------------------
     Auto-connect socket when authenticated
  ---------------------------------------------------- */
  useEffect(() => {
    if (auth?.accessToken && !auth?.mustChangePassword) {
      connectSocket();
    }
  }, [auth?.accessToken, auth?.mustChangePassword]);

  /* ----------------------------------------------------
     LOGIN
  ---------------------------------------------------- */
  const login = async ({ email, password }) => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;

    // 🔒 FORCE PASSWORD CHANGE FLOW
    if (data.must_change_password) {
      localStorage.setItem("egym_temp_token", data.temp_token);
      localStorage.setItem("egym_must_change_password", "true");

      setAuthState({
        accessToken: data.temp_token,
        user: data.user,
        mustChangePassword: true
      });

      navigate("/force-password-change");
      return;
    }

    // ✅ NORMAL LOGIN
    setAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    });

    localStorage.setItem("egym_must_change_password", "false");

    setAuthState({
      accessToken: data.access_token,
      user: data.user,
      mustChangePassword: false
    });

    redirectByRole(data.user.role);
  } finally {
    setLoading(false);
  }
};


  /* ----------------------------------------------------
     FORCE PASSWORD CHANGE
  ---------------------------------------------------- */
const forceChangePassword = async (newPassword) => {
  setLoading(true);
  try {
    const res = await api.put("/auth/force-change-password", {
      new_password: newPassword
    });

    // 🔑 STORE REAL TOKENS
    setAuth({
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      user: res.data.user
    });

    localStorage.removeItem("egym_temp_token");
    localStorage.setItem("egym_must_change_password", "false");

    setAuthState({
      accessToken: res.data.access_token,
      user: res.data.user,
      mustChangePassword: false
    });

    redirectByRole(res.data.user.role);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to change password"
    };
  } finally {
    setLoading(false);
  }
};

  /* ----------------------------------------------------
     LOGOUT
  ---------------------------------------------------- */
  const logout = () => {
    clearAuth();
    localStorage.removeItem("egym_must_change_password"); // ✅ ADD THIS
    setAuthState(null);
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
            await api.put("/auth/change-password", {
              current_password: currentPassword,
              new_password: newPassword
            });
            return { success: true };
          } catch (err) {
            return { 
              success: false, 
              error: err.response?.data?.error || "Failed to change password" 
            };
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