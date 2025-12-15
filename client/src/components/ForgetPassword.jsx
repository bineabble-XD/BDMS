import React, { useState } from "react";
import { Link } from "react-router-dom";
import donorIllustration from "../assets/9+.png";

const API_BASE = "http://localhost:5050";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
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
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-start">
        <div
          className="col-md-7 auth-left"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >

          <h3
            className="fw-semibold mb-2"
            style={{ color: "#d10000" }}
          >
            Update Password
          </h3>

          <p className="small text-muted mb-4">
            Enter your registered email and we will send you a reset link.
          </p>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <p className="small mt-3">
              Remember your password?{" "}
              <Link to="/login" className="text-danger text-decoration-none">
                Back to login
              </Link>
            </p>
          </div>
        </div>

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

export default ForgetPassword;
