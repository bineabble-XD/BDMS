import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthMessage } from '../features/authSlice';
import donorIllustration from '../assets/donor.png';
import mlogo from '../assets/mlogo.jpg';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fName: '',
    phoneNum: '',
    Age: '',
    gender: '',
    bloodType: '',
    role: '',
    email: '',
    password: '',
    address: '',
  });

  // password validation state
  const [passwordValidations, setPasswordValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

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

    // live password validation
    if (name === 'password') {
      validatePassword(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5050/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || 'Failed to register');
        return;
      }

      alert(data.message || 'Registered successfully!');
      navigate('/login');
    }
  }, [message, navigate, dispatch]);

  // errors
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-center">
        <div className="col-md-7 auth-left">
          {/* Logo + Title */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                objectFit: 'cover',
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span>{' '}
                <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <h3 className="mb-3 fw-semibold">Registration</h3>

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
                placeholder="Enter your Full Name"
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                placeholder="Enter your Phone Number"
                required
              />
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
                  placeholder="Enter your Age"
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

            {/* Blood type + Role */}
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

              <div className="col-md-6 mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select role</option>
                  <option>Donor</option>
                  <option>Hospital</option>
                  <option>Recipient</option>
                  <option>Admin</option>
                </select>
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
                placeholder="Enter your Email"
                required
              />
            </div>

            {/* Password + Rules */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a strong Password"
                required
              />

              {/* Password Rules */}
              <div className="mt-2">
                <strong>PASSWORD MUST CONTAIN:</strong>
                <ul
                  style={{
                    listStyle: 'none',
                    paddingLeft: 0,
                    marginTop: '10px',
                  }}
                >
                  <li
                    style={{
                      color: passwordValidations.lower ? 'green' : 'red',
                    }}
                  >
                    {passwordValidations.lower ? '✔' : '✘'} At least one
                    lowercase letter
                  </li>
                  <li
                    style={{
                      color: passwordValidations.upper ? 'green' : 'red',
                    }}
                  >
                    {passwordValidations.upper ? '✔' : '✘'} At least one
                    uppercase letter
                  </li>
                  <li
                    style={{
                      color: passwordValidations.number ? 'green' : 'red',
                    }}
                  >
                    {passwordValidations.number ? '✔' : '✘'} At least one
                    number
                  </li>
                  <li
                    style={{
                      color: passwordValidations.special ? 'green' : 'red',
                    }}
                  >
                    {passwordValidations.special ? '✔' : '✘'} At least one
                    special character
                  </li>
                  <li
                    style={{
                      color: passwordValidations.length ? 'green' : 'red',
                    }}
                  >
                    {passwordValidations.length ? '✔' : '✘'} Minimum 8
                    characters
                  </li>
                </ul>
              </div>
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
                placeholder="Enter your Address"
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
                I accept the terms &amp; condition
              </label>
            </div>

            <p className="small text-muted mb-3">
              <a href="#tc" className="text-decoration-underline">
                Read our T&amp;Cs
              </a>
            </p>

            <button
              type="submit"
              className="btn btn-danger w-100"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Illustration */}
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
