import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return setError("Please fill in all fields.");
    }

    try {
      const res = await axios.get("http://localhost:3001/users", {
        params: { email: form.email },
      });

      const user = res.data[0];
      if (!user || user.password !== form.password) {
        return setError("Invalid email or password");
      }

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="auth-bg d-flex flex-column min-vh-100">
      {/* Optional simple navbar to match the site */}
      <nav className="navbar navbar-dark bg-danger shadow-sm">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img
              src={Logo}
              alt="Logo"
              style={{ height: "48px" }}
              className="me-2"
            />
            <span className="navbar-brand fw-bold">Spice Stories</span>
          </div>
          <Link to="/" className="btn btn-outline-light btn-sm rounded-pill">
            Home
          </Link>
        </div>
      </nav>

      {/* Centered auth card */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="auth-card p-4 p-md-5 shadow-lg">
          <h2 className="text-center auth-title mb-4">Login</h2>

          {error && (
            <p className="text-danger text-center small mb-3">{error}</p>
          )}

          <input
            type="email"
            name="email"
            className="form-control auth-input mb-3"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="form-control auth-input mb-4"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="btn auth-primary-btn w-100 mb-3 rounded-pill"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            className="btn auth-secondary-btn w-100 rounded-pill"
            onClick={goToRegister}
          >
            Create New Account
          </button>

          <p className="text-center text-muted small mt-3 mb-0">
            By continuing, you agree to our{" "}
            <span className="text-danger">Terms</span> &amp;{" "}
            <span className="text-danger">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
