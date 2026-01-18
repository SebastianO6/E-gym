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

      // ✅ Use setAuth from utils/authLocal.js
      setAuth({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user
      });

      // ✅ STORE PASSWORD FLAG SEPARATELY
      localStorage.setItem(
        "egym_must_change_password",
        data.must_change_password ? "true" : "false"
      );



      // Set local auth state
      const authState = {
        accessToken: data.access_token,
        user: data.user,
        mustChangePassword: data.must_change_password || false
      };
      
      setAuthState(authState);

      // Check if user must change password
      if (data.must_change_password) {
        navigate("/force-password-change");
        return;
      }

      redirectByRole(data.user?.role);
    } catch (err) {
      throw err;
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
      await api.put("/auth/force-change-password", {
        new_password: newPassword
      });
      
      // Update user in localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        currentUser.must_change_password = false; 
        setAuth({
          access_token: getAuthToken(),
          user: currentUser
        });

        localStorage.setItem("egym_must_change_password", "false");

      }
      
      // Update local state
      setAuthState(prev => ({
        ...prev,
        mustChangePassword: false
      }));
      
      // Redirect
      redirectByRole(auth?.user?.role);
      
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