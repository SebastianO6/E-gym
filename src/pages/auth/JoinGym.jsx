import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { getGymBySlug } from "../../services/authServices";
import styles from "./JoinGym.module.css";

const JoinGym = () => {
  const { gymSlug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGym, setLoadingGym] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadGym = async () => {
      try {
        const gymData = await getGymBySlug(gymSlug);
        if (mounted) {
          setGym(gymData);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.error || "Gym not found");
        }
      } finally {
        if (mounted) {
          setLoadingGym(false);
        }
      }
    };

    loadGym();

    return () => {
      mounted = false;
    };
  }, [gymSlug]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.email || !form.phone) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/auth/register", {
        ...form,
        gym_slug: gymSlug,
      });

      navigate(`/accept-invite?token=${res.data.activation_token}`);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{loadingGym ? "Loading gym..." : `Join ${gym?.name || "Gym"}`}</h2>

      {!loadingGym && gym && (
        <p className={styles.subtitle}>
          Register yourself as a member, then set your password to activate your account.
        </p>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => updateField("first_name", e.target.value)}
        />

        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => updateField("last_name", e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />

        <button disabled={loading || loadingGym || !gym}>
          {loading ? "Creating..." : "Join Gym"}
        </button>
      </form>
    </div>
  );
};

export default JoinGym;
