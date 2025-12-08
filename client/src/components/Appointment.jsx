// src/components/Appointment.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import donorIllustration from "../assets/11+.png";

const Appointment = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospital: "Khawla Hospital",
    appointmentMonth: "",
    appointmentTime: "",
    lastDonationMonth: "",
    donatedBefore: false,
    sickPast3Months: false,
    medsRecently: "",
    hasColdFluFever: "",
    medicalRestriction: "",
    confirmHealth: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Appointment request submitted!");
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="appointment-page container-fluid"  style={{ paddingBottom: "80px" }}>
      {/* NAVBAR 
      <header className="bdms-navbar shadow-sm mb-4">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
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

          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/home" className="nav-link">
              Home
            </Link>
            <Link to="/home#urgent" className="nav-link">
              Urgent Requests
            </Link>
            <span className="nav-link active-link">Appointments</span>
          </nav>
        </div>
      </header>
      */}

      {/* MAIN CONTENT (same idea as Register.jsx) */}
      <div className="row min-vh-100 align-items-center">
        {/* LEFT SIDE – form column */}
        <div
          className="col-md-7 auth-left"
          style={{
            paddingRight: "10px",
          }}
        >
          <h3 className="fw-semibold mb-4 mt-3" style={{ color: "#d10000" }}>
            Book an Appointment
          </h3>

          {/* Centered Form Container */}
          <div style={{ maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff", }}>
            <form onSubmit={handleSubmit}>
              <h5 className="mb-3">Appointment Details</h5>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Preferred Hospital
                </label>
                <select
                  className="form-select"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                >
                  <option>Khawla Hospital</option>
                  <option>Royal Hospital</option>
                  <option>Sultan Qaboos University Hospital</option>
                  <option>Armed Forces Hospital</option>
                </select>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Appointment Month
                  </label>
                  <select
                    className="form-select"
                    name="appointmentMonth"
                    value={form.appointmentMonth}
                    onChange={handleChange}
                  >
                    <option value="">Select month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Last Donation Month
                </label>
                <select
                  className="form-select"
                  name="lastDonationMonth"
                  value={form.lastDonationMonth}
                  onChange={handleChange}
                >
                  <option value="">Select month</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <h5 className="mb-3 mt-4">Eligibility Screening</h5>

              {/* CHECKBOXES */}
              <div className="mb-4">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="donatedBefore"
                    checked={form.donatedBefore}
                    onChange={handleChange}
                  />
                  <label className="form-check-label ms-1">
                    I have donated blood before
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="sickPast3Months"
                    checked={form.sickPast3Months}
                    onChange={handleChange}
                  />
                  <label className="form-check-label ms-1">
                    I was sick in the past 3 months
                  </label>
                </div>
              </div>

              {/* RADIO GROUPS */}
              <div className="mb-4">
                <p className="fw-semibold mb-2">Medication recently?</p>
                <div className="d-flex flex-column gap-2">
                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="medsRecently"
                      value="yes"
                      checked={form.medsRecently === "yes"}
                      onChange={handleChange}
                    />
                    Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="medsRecently"
                      value="no"
                      checked={form.medsRecently === "no"}
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-semibold mb-2">Cold, flu, or fever?</p>
                <div className="d-flex flex-column gap-2">
                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="hasColdFluFever"
                      value="yes"
                      checked={form.hasColdFluFever === "yes"}
                      onChange={handleChange}
                    />
                    Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="hasColdFluFever"
                      value="no"
                      checked={form.hasColdFluFever === "no"}
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <p className="fw-semibold mb-2">Any medical restrictions?</p>
                <div className="d-flex flex-column gap-2">
                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="medicalRestriction"
                      value="yes"
                      checked={form.medicalRestriction === "yes"}
                      onChange={handleChange}
                    />
                    Yes
                  </label>

                  <label>
                    <input
                      type="radio"
                      className="me-1"
                      name="medicalRestriction"
                      value="no"
                      checked={form.medicalRestriction === "no"}
                      onChange={handleChange}
                    />
                    No
                  </label>
                </div>
              </div>

              <div className="form-check mb-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="confirmHealth"
                  checked={form.confirmHealth}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label ms-1">
                  I confirm that the above health information is accurate.
                </label>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-danger flex-grow-1">
                  Book Appointment
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE – smaller illustration, same idea as Register */}
        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt="Donor illustration"
            className="auth-illustration img-fluid"
            style={{ maxWidth: "70%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointment;
