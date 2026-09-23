import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Employee Management System
        </h1>

        <p style={styles.subtitle}>
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={styles.input}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={styles.input}
          />

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2f6",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "400px",
    padding: "35px",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
  },

  title: {
    textAlign: "center",
    color: "#16355d",
    fontSize: "25px",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "30px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "18px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "15px",
  },

  error: {
    padding: "10px",
    marginBottom: "15px",
    background: "#ffe6e6",
    color: "#c62828",
    borderRadius: "5px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    background: "#16355d",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Login;