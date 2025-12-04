// src/components/Register.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/9+.png";
import bdmslogo from "../assets/bdmslogo.png";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fName: "",
    phoneNum: "",
    Age: "",
    gender: "",
    bloodType: "",
    role: "Donor", // always donor
    email: "",
    password: "",
    address: "",
  });

  // country code (for phone)
  const [countryCode, setCountryCode] = useState("+968"); // default Oman

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

  const validatePassword = (password) => {
    setPasswordValidations({
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password), // special character
      length: password.length >= 8,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Name validation: only letters + spaces, max 20 chars
    if (name === "fName") {
      const onlyLetters = /^[A-Za-z\s]*$/;

      // block numbers/symbols
      if (!onlyLetters.test(value)) return;

      // limit to 20 characters
      if (value.length > 20) return;
    }

    if (name === "password") {
      validatePassword(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ combine country code + phone for backend
    const numericCode = countryCode.replace("+", "");
    const payload = {
      ...formData,
      phoneNum: numericCode + formData.phoneNum,
      role: "Donor", // enforce donor
    };

    dispatch(registerUser(payload));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearAuthMessage());
      navigate("/login");
    }
  }, [message, dispatch, navigate]);

  return (
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-center">
        <div
          className="col-md-7 auth-left" //remove the style to remove the scroll in registeration
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          

          <h3 className="mb-3 fw-semibold" style={{ color: "#d10000" }}>
            Registration
          </h3>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form className="register-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  required
                  maxLength={20}
                />
                <small className="text-muted">Max 20 letters.</small>
              </div>

              {/* Phone with country code */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <div className="row g-2">
                  <div className="col-3">
                    <select
                      className="form-select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+968">+968</option>
                      <option value="+971">+971</option>
                      <option value="+966">+966</option>
                      <option value="+974">+974</option>
                      <option value="+973">+973</option>
                      <option value="+965">+965</option>
                    </select>
                  </div>
                  <div className="col-9">
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNum"
                      value={formData.phoneNum}
                      onChange={handleChange}
                      required
                      placeholder="91234567"
                    />
                  </div>
                </div>
              </div>

              {/* Age + Gender */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    min="18"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Blood Type + Role (fixed) */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Blood Type</label>
                  <select
                    className="form-select"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select blood type</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>

                {/* Role fixed as Donor */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value="Donor"
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password + Popup */}
              <div className="mb-3 position-relative">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Address */}
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Terms */}
              <div className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  I accept the terms & condition
                </label>
              </div>

              <p className="small text-muted mb-3">
                <a href="#tc" className="text-decoration-underline">
                  Read our T&Cs
                </a>
              </p>

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </div>

          <p className="mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-underline">
              Login
            </Link>
          </p>

          <p className="mt-3">
            Are you a hospital?{" "}
            <Link
              to="/register-hospital"
              className="text-decoration-underline"
            >
              Register your hospital here
            </Link>
          </p>
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

export default Register;
