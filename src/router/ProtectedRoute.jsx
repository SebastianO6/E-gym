import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!auth?.accessToken || !auth?.user) {
    return <Navigate to="/login" replace />;
  }

  const currentPath = window.location.pathname;

  if (auth.mustChangePassword && currentPath !== "/force-password-change") {
    return <Navigate to="/force-password-change" replace />;
  }

  if (currentPath === "/force-password-change" && !auth.mustChangePassword) {
    if (auth.user.role === "superadmin") return <Navigate to="/superadmin" replace />;
    if (auth.user.role === "gymadmin") return <Navigate to="/gymadmin" replace />;
    if (auth.user.role === "trainer") return <Navigate to="/trainer" replace />;
    return <Navigate to="/client" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
