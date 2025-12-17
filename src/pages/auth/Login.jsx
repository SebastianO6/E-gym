import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";
import { Mail, Lock, Dumbbell, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      setError("Invalid credentials or network error.");
    }
  }

  return (
    <div className={styles.container}>
      
      {/* Visual Brand Section */}
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.logoCircle}>
            <Dumbbell size={40} color="white" />
          </div>
          <h1 className={styles.brandTitle}>E-Gym Portal</h1>
          <p className={styles.brandText}>
            Streamline your fitness management with our professional suite. 
            Track progress, manage clients, and achieve goals.
          </p>
        </div>
        <div className={styles.overlay}></div>
      </div>

      {/* Login Form Section */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <div className={styles.mobileLogo}>
               <Dumbbell size={24} color="#4f46e5" />
            </div>
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.icon} size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <Lock className={styles.icon} size={20} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <span className={styles.errorDot}></span>
                {error}
              </div>
            )}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={18} />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className={styles.footer}>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}