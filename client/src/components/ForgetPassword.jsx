import React, { useState } from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";
import donorIllustration from "../assets/donor.png";

const API_BASE = "http://localhost:5050";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);    // success / error text
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.message || "Something went wrong. Please try again.");
      } else {
        setStatus(
          data.message ||
            "If an account with that email exists, a reset link has been sent."
        );
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

          <h2 className="auth-title mb-4">Forgot/Reset Password</h2>
          <p className="small text-muted mb-3">
            Enter your registered email and we will send you a password reset
            link.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {status && (
            <p className="small text-muted mb-2">
              {status}
            </p>
          )}

          <p className="small mt-2">
            Remembered your password?{" "}
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

export default ForgetPassword;
