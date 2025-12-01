// src/components/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/donor.png";
import bdmslogo from "../assets/bdmslogo.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth || {});
  const { loading, error, user } = auth;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // Redirect after login
  useEffect(() => {
    if (!user) return;

    if (!user.isVerified) {
      alert("Please verify your email before logging in.");
      return;
    }

    if (user.isAdmin === true) navigate("/reports");
    else navigate("/home");
  }, [user, navigate]);

  // Show error
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

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
          {/* Logo */}
          <div className="d-flex align-items-center gap-2 mb-4">
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

          {/* Page Title */}
          <h3 className="fw-semibold mb-4" style={{ color: "#d10000" }}>
            Login
          </h3>

          {/* Centered form */}
          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Links */}
            <p className="small">
              Forget password?{" "}
              <Link
                to="/forget-password"
                className="text-danger text-decoration-none"
              >
                Reset here
              </Link>
            </p>

            <p className="small">
              Don’t have an account?{" "}
              <Link to="/register" className="text-danger text-decoration-none">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Illustration */}
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

export default Login;
