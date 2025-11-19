// src/components/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import donorIllustration from '../assets/donor.png';

const Register = () => {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    bloodType: '',
    role: '',
    email: '',
    password: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5050/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to register');
        return;
      }

      alert('Registered successfully!');
      navigate('/login'); // after successful sign up go back to login page
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-center">
        {/* LEFT SIDE – NAV + FORM */}
        <div className="col-md-7">
          {/* TOP NAVBAR */}
          <header className="d-flex justify-content-between align-items-center mb-4">
            {/* Logo + text */}
            <div className="d-flex align-items-center gap-2">
              <div className="logo-icon"></div>
              <div>
                <div className="logo-title">
                  <span className="text-danger fw-bold">BLOOD</span>{' '}
                  <span className="fw-bold">DONATION</span>
                </div>
                <div className="logo-subtitle small text-muted">
                  MANAGEMENT SYSTEM
                </div>
              </div>
            </div>

            {/* Nav links (simple, not functional yet) */}
            <nav className="nav gap-4">
              <Link className="nav-link" to="#">
                Home
              </Link>
              <Link className="nav-link" to="#">
                About Us
              </Link>
              <Link className="nav-link" to="#">
                Urgent Requests
              </Link>
              <Link className="nav-link active-link" to="/register">
                Register Now
              </Link>
              <Link className="nav-link" to="/login">
                Log In
              </Link>
            </nav>
          </header>

          {/* TITLE */}
          <h3 className="mb-3 text-center fw-semibold">Registration</h3>

          {/* FORM */}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your Full Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your Phone Number"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={formData.age}
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
                  <option>Recipient</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

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
            </div>

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

            <button type="submit" className="btn btn-dark w-100">
              Register
            </button>
          </form>
        </div>

        {/* RIGHT SIDE – IMAGE */}
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
