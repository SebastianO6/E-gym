// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { auth, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f9fafb'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: '#6b7280' }}>Loading...</p>
      </div>
    </div>
  );

  // Check if user is authenticated
  if (!auth?.accessToken || !auth?.user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Check if user must change password
  const currentPath = window.location.pathname;
  if (auth.mustChangePassword && currentPath !== '/force-password-change') {
    return <Navigate to="/force-password-change" replace />;
  }

  // ✅ If user is on password change page but doesn't need to, redirect to dashboard
  if (currentPath === '/force-password-change' && !auth.mustChangePassword) {
    // Redirect based on role
    if (auth.user.role === 'superadmin') return <Navigate to="/superadmin" replace />;
    if (auth.user.role === 'gymadmin') return <Navigate to="/gymadmin" replace />;
    if (auth.user.role === 'trainer') return <Navigate to="/trainer" replace />;
    return <Navigate to="/client" replace />;
  }

  // Check role-based access
  if (allowedRoles.length && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}