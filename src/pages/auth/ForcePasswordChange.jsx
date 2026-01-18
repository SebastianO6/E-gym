// src/components/auth/ForcePasswordChange.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './ForcePasswordChange.module.css';

const ForcePasswordChange = () => {
  const { forceChangePassword, logout, auth } = useAuth();
  const [password, setPassword] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (password.new_password !== password.confirm_password) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (password.new_password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    const result = await forceChangePassword(password.new_password);
    
    if (result.success) {
      setSuccess("Password changed successfully! Redirecting to dashboard...");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Password strength checker
  const checkPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "#e5e7eb" };
    
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;

    let label = "", color = "";
    if (strength <= 25) {
      label = "Weak";
      color = "#ef4444";
    } else if (strength <= 50) {
      label = "Fair";
      color = "#f59e0b";
    } else if (strength <= 75) {
      label = "Good";
      color = "#10b981";
    } else {
      label = "Strong";
      color = "#059669";
    }

    return { strength, label, color };
  };

  const passwordStrength = checkPasswordStrength(password.new_password);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Shield size={48} className={styles.icon} />
          <h1 className={styles.title}>Change Your Password</h1>
          <p className={styles.subtitle}>
            Your account requires a password change before you can proceed.
            Please set a new secure password.
          </p>
          {auth?.user && (
            <div className={styles.userInfo}>
              <p>Account: <strong>{auth.user.email}</strong></p>
              <p>Role: <span className={styles.roleBadge}>{auth.user.role}</span></p>
            </div>
          )}
        </div>

        {success && (
          <div className={styles.successAlert}>
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showNew ? "text" : "password"}
                className={styles.input}
                value={password.new_password}
                onChange={(e) => setPassword({...password, new_password: e.target.value})}
                placeholder="Enter new password"
                required
                autoFocus
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password.new_password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div 
                    className={styles.strengthFill}
                    style={{
                      width: `${passwordStrength.strength}%`,
                      background: passwordStrength.color
                    }}
                  ></div>
                </div>
                <div className={styles.strengthLabel}>
                  Strength: <span style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm New Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirm ? "text" : "password"}
                className={styles.input}
                value={password.confirm_password}
                onChange={(e) => setPassword({...password, confirm_password: e.target.value})}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password.new_password && password.confirm_password && (
              <div className={`${styles.matchIndicator} ${
                password.new_password === password.confirm_password 
                  ? styles.matched 
                  : styles.notMatched
              }`}>
                {password.new_password === password.confirm_password 
                  ? "✓ Passwords match" 
                  : "✗ Passwords do not match"}
              </div>
            )}
          </div>

          <div className={styles.rules}>
            <h4>Password Requirements:</h4>
            <ul>
              <li className={password.new_password.length >= 8 ? styles.met : styles.unmet}>
                At least 8 characters long
              </li>
              <li className={/[A-Z]/.test(password.new_password) ? styles.met : styles.unmet}>
                Contains at least one uppercase letter
              </li>
              <li className={/\d/.test(password.new_password) ? styles.met : styles.unmet}>
                Contains at least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(password.new_password) ? styles.met : styles.unmet}>
                Contains at least one special character
              </li>
            </ul>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleLogout}
              className={styles.logoutBtn}
            >
              Cancel & Logout
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !password.new_password || !password.confirm_password}
            >
              {loading ? 'Changing Password...' : 'Change Password & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForcePasswordChange;