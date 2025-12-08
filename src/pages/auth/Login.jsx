import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password }); // AuthContext handles redirects
    } catch (err) {
      setError("Invalid credentials or network error.");
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h2>E-Gym Login</h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
