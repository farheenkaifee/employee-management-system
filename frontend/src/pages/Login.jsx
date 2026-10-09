import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Check your credentials and backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="brand-logo">
          <Users size={30} />
        </div>

        <h1>PeopleDesk</h1>
        <p>Employee Records & Document Management</p>

        <div className="login-message">
          <h2>Everything organized.</h2>
          <h2>Everyone connected.</h2>
          <p>
            A centralized workspace for employee information,
            documents and leave requests.
          </p>
        </div>

        <span className="brand-footer">
          Employee Management System
        </span>
      </div>

      <div className="login-form-section">
        <form className="login-card" onSubmit={handleSubmit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="muted">
            Enter your credentials to continue.
          </p>

          <label htmlFor="email">Email address</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <LockKeyhole size={18} />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <p className="login-note">
            Access is available to authorized users only.
          </p>
        </form>
      </div>
    </div>
  );
}