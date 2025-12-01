// src/components/ResetPassword.jsx

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import donorIllustration from "../assets/donor.png";

const API_BASE = "http://localhost:5050";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.message || "Reset link is invalid or has expired.");
      } else {
        setStatus(data.message || "Password reset successful. Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setStatus("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-start">
        {/* LEFT SIDE */}
        <div
          className="col-md-7 auth-left"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {/* Logo */}
          <div className="d-flex align-items-center gap-2 mb-4 mt-3">
            <img
              src={bdmslogo}
              alt="BDMS Logo"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          {/* Title */}
          <h3
            className="fw-semibold mb-2"
            style={{ color: "#d10000" }}
          >
            Reset Password
          </h3>

          <p className="small text-muted mb-4">
            Choose a new password for your BDMS account.
          </p>

          {/* Centered form container */}
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </form>

            {status && (
              <p className="small text-muted mb-2">
                {status}
              </p>
            )}

            <p className="small mt-3">
              <Link to="/login" className="text-danger text-decoration-none">
                Back to login
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt="Blood donor"
            className="auth-illustration img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
