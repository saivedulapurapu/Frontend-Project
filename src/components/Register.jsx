import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/LOGO.png";
import "./Login.css"; // reuse same styles

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      // Check if email already exists
      const existing = await axios.get("http://localhost:3001/users", {
        params: { email },
      });

      if (existing.data.length > 0) {
        return setError("Email is already registered.");
      }

      await axios.post("http://localhost:3001/users", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="auth-bg d-flex flex-column min-vh-100">
      {/* Navbar */}
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

      {/* Centered card */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="auth-card p-4 p-md-5 shadow-lg">
          <h2 className="text-center auth-title mb-4">Create Account</h2>

          {error && (
            <p className="text-danger text-center small mb-3">{error}</p>
          )}

          <input
            type="text"
            name="name"
            className="form-control auth-input mb-3"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            className="form-control auth-input mb-3"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            className="form-control auth-input mb-3"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            className="form-control auth-input mb-4"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            className="btn auth-primary-btn w-100 mb-3 rounded-pill"
            onClick={handleRegister}
          >
            Register
          </button>

          <button
            className="btn auth-secondary-btn w-100 rounded-pill"
            onClick={goToLogin}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
