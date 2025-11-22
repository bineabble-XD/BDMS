import React, { useState } from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";
import donorIllustration from "../assets/donor.png"; // غيّرها للصورة اللي تحبها لو حاب

const Appointment = () => {
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
    console.log("Appointment data:", form);
    alert("Appointment request submitted!");
  };

  return (
    <div className="appt-page">
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: "70px",
                height: "70px",
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
            <Link to="/" className="nav-link">
              Dashboards
            </Link>
            <Link to="/urgent" className="nav-link">
              Urgent Requests
            </Link>
            <span className="nav-link active-link">Appointments</span>
            <Link to="/reports" className="nav-link">
              Reports
            </Link>
            <button className="btn btn-danger ms-3 px-4">Log out</button>
          </nav>
        </div>
      </header>

      <main className="appt-main">
        <div className="container">
          <h2 className="text-center mb-4 appt-title">Book an Appointment</h2>

          <div className="row justify-content-center">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img
                src={donorIllustration}
                alt="Donor illustration"
                className="img-fluid appt-illustration"
              />
            </div>

            <div className="col-md-6">
              <form className="appt-form" onSubmit={handleSubmit}>
                <h5 className="mb-3">Appointment Details</h5>

                <div className="mb-3">
                  <label className="form-label">Preferred Hospital</label>
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Appointment Month</label>
                    <select
                      className="form-select"
                      name="appointmentMonth"
                      value={form.appointmentMonth}
                      onChange={handleChange}
                    >
                      <option value="">Select month</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                      <option>May</option>
                      <option>June</option>
                      <option>July</option>
                      <option>August</option>
                      <option>September</option>
                      <option>October</option>
                      <option>November</option>
                      <option>December</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="appointmentTime"
                      value={form.appointmentTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Last Donation Month</label>
                  <select
                    className="form-select"
                    name="lastDonationMonth"
                    value={form.lastDonationMonth}
                    onChange={handleChange}
                  >
                    <option value="">Select month</option>
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="donatedBefore"
                      name="donatedBefore"
                      checked={form.donatedBefore}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="donatedBefore">
                      I have donated blood before
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="sickPast3Months"
                      name="sickPast3Months"
                      checked={form.sickPast3Months}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sickPast3Months"
                    >
                      I was sick past 3 months
                    </label>
                  </div>
                </div>

                <h5 className="mb-2">Health &amp; Eligibility Screening</h5>

                <div className="mb-2">
                  <p className="mb-1">
                    Have you taken any medication recently?
                  </p>
                  <div className="d-flex gap-3">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="medsRecently"
                        value="yes"
                        checked={form.medsRecently === "yes"}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="medsRecently"
                        value="no"
                        checked={form.medsRecently === "no"}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="mb-2">
                  <p className="mb-1">
                    Do you currently have cold, flu, or fever?
                  </p>
                  <div className="d-flex gap-3">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="hasColdFluFever"
                        value="yes"
                        checked={form.hasColdFluFever === "yes"}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="hasColdFluFever"
                        value="no"
                        checked={form.hasColdFluFever === "no"}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mb-1">
                    Are you under any medical restrictions for donating blood?
                  </p>
                  <div className="d-flex gap-3">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="medicalRestriction"
                        value="yes"
                        checked={form.medicalRestriction === "yes"}
                        onChange={handleChange}
                      />
                      Yes
                    </label>
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input me-1"
                        name="medicalRestriction"
                        value="no"
                        checked={form.medicalRestriction === "no"}
                        onChange={handleChange}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="confirmHealth"
                    name="confirmHealth"
                    checked={form.confirmHealth}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor="confirmHealth">
                    I confirm that the above health information is accurate.
                  </label>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-danger flex-grow-1 appt-submit-btn"
                  >
                    Book Appointment
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary flex-grow-1"
                    onClick={() =>
                      setForm({
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
                      })
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointment;
