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

  // password validation state
  const [passwordValidations, setPasswordValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  // popup state
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const validatePassword = (value) => {
    setPasswordValidations({
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
      length: value.length >= 8,
    });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setStatus("Passwords do not match.");
      return;
    }

    const rulesPassed = Object.values(passwordValidations).every((x) => x);
    if (!rulesPassed) {
      setStatus("Password does not meet the required criteria.");
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
          <h3 className="fw-semibold mb-2" style={{ color: "#d10000" }}>
            Reset Password
          </h3>

          <p className="small text-muted mb-4">
            Choose a new password for your BDMS account.
          </p>

          {/* Form container with border */}
          <div
            style={{
              maxWidth: "420px",
              margin: "0 auto",
              border: "1px solid #ddd",
              padding: "25px 20px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-3 position-relative">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  onFocus={() => setShowPasswordHints(true)}
                  onBlur={() => setShowPasswordHints(false)}
                />

                {showPasswordHints && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "6px",
                      padding: "8px 10px",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      fontSize: "12px",
                      zIndex: 10,
                      minWidth: "250px",
                    }}
                  >
                    <strong style={{ fontSize: "11px" }}>
                      PASSWORD MUST CONTAIN:
                    </strong>
                    <ul
                      style={{
                        listStyle: "none",
                        paddingLeft: 0,
                        marginTop: "6px",
                        marginBottom: 0,
                      }}
                    >
                      <li
                        style={{
                          color: passwordValidations.lower ? "green" : "red",
                        }}
                      >
                        {passwordValidations.lower ? "✔" : "✘"} At least one
                        lowercase letter
                      </li>
                      <li
                        style={{
                          color: passwordValidations.upper ? "green" : "red",
                        }}
                      >
                        {passwordValidations.upper ? "✔" : "✘"} At least one
                        uppercase letter
                      </li>
                      <li
                        style={{
                          color: passwordValidations.number ? "green" : "red",
                        }}
                      >
                        {passwordValidations.number ? "✔" : "✘"} At least one
                        number
                      </li>
                      <li
                        style={{
                          color: passwordValidations.special ? "green" : "red",
                        }}
                      >
                        {passwordValidations.special ? "✔" : "✘"} At least one
                        special character
                      </li>
                      <li
                        style={{
                          color: passwordValidations.length ? "green" : "red",
                        }}
                      >
                        {passwordValidations.length ? "✔" : "✘"} Minimum 8
                        characters
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </form>

            {/* Status message */}
            {status && <p className="small text-muted mb-2">{status}</p>}

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
