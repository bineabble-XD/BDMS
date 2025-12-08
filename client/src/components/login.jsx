// src/components/Login.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/1+.png";
import bdmslogo from "../assets/bdmslogo.png";

//inventory login (no database)
const INVENTORY_EMAIL = "inventory@bdms.com";
const INVENTORY_PASSWORD = "Blood@123";



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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim();
    const password = formData.password;

    if (email === INVENTORY_EMAIL && password === INVENTORY_PASSWORD) {
      navigate("/inventory");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  // After user login
  useEffect(() => {
    if (!user) return;

    // Admin check
    if (user.isAdmin === true) {
      navigate("/reports");
      return;
    }

    // Hospital check (normal hospital)
    if (user.isHospital === true) {
      // Fetch hospital profile to check if it's blood inventory
      fetch(`http://localhost:5050/hospitals/profile/${user._id}`)
        .then((res) => res.json())
        .then((profile) => {
          if (profile?.type === "Blood Inventory") {
            navigate("/inventory");
          } else {
            navigate("/hospital-dash");
          }
        });
      return;
    }

    // Default donor redirect
    navigate("/home");
  }, [user, navigate]);



  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="login-page container-fluid">
      <div className="row min-vh-100 align-items-center">

        {/* LEFT SIDE: Title + Form */}
        <div className="col-md-7 d-flex justify-content-end">
          <div style={{ width: "100%", maxWidth: "480px" }}>

            {/* Page Title */}
            <h4 className="text-center mb-4" style={{ color: "#d10000", fontWeight: 600 }}>
              Login
            </h4>

            {/* Form Card */}
            <div className="form-wrapper">

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small text-muted">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Your Email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label small text-muted">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Your Password"
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
              <p className="small mb-1">
                Forget password?{" "}
                <Link to="/forget-password" className="text-danger text-decoration-none">
                  Reset here
                </Link>
              </p>

              <p className="small mb-0">
                Don’t have an account?{" "}
                <Link to="/register" className="text-danger text-decoration-none">
                  Sign up
                </Link>
              </p>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Illustration (Option 2 applied) */}
        <div className="col-md-5 d-flex justify-content-start align-items-center d-none d-md-flex">
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
