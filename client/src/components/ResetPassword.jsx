import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";
import donorIllustration from "../assets/donor.png";

const API_BASE = "http://localhost:5050";

const ResetPassword = () => {
  const { token } = useParams();           // comes from URL /reset-password/:token
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
    <div className="auth-page container-fluid">
      <div className="row align-items-center min-vh-100">
        {/* LEFT SIDE */}
        <div className="col-md-6 auth-left">
          <div className="d-flex align-items-center gap-2 mb-4">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span>{" "}
                <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <h2 className="auth-title mb-4">Reset Password</h2>
          <p className="small text-muted mb-3">
            Choose a new password for your BDMS account.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
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

          {status && <p className="small text-muted mb-2">{status}</p>}

          <p className="small mt-2">
            <Link to="/login" className="text-danger text-decoration-none">
              Back to login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 auth-right text-center">
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
