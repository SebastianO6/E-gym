import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios"; 
import "./AcceptInvite.module.css";

const AcceptInvite = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invite token");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("/auth/accept-invite", {
        token,
        password,
      });

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Invite is invalid or has already been used"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="accept-invite-container success">
        <h2>Account Activated 🎉</h2>
        <p>Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <div className="accept-invite-container">
      <h2>Activate Your Account</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit" disabled={loading || !token}>
          {loading ? "Activating..." : "Activate Account"}
        </button>
      </form>
    </div>
  );
};

export default AcceptInvite;
