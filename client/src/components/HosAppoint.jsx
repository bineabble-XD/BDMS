// src/components/HosAppoint.jsx
import React from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";   // hospital logo
import heroImg from "../assets/2.png";     // illustration

const HosAppoint = () => {
  return (
    <div className="appointments-page">
      {/* NAVBAR */}
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
  <Link to="/hos-reports" className="nav-link">
    Reports
  </Link>

  <Link to="/hospital-appointments" className="nav-link">
    Appointments
  </Link>

  <span className="nav-link active-link">Dashboard</span>

  {/* Hospital Name */}
  <span className="nav-link fw-bold">
    {hospital?.fName || "Hospital User"}
  </span>

  {/* Profile Icon */}
  <Link
    to="/admin-profile"   // or /hospital-profile if you want later
    className="admin-profile-icon d-flex align-items-center justify-content-center"
    title="Profile"
  >
    {hospital?.fName?.charAt(0).toUpperCase() || "H"}
  </Link>

  {/* Logout Button */}
  <button
    className="btn btn-outline-danger btn-sm ms-2"
    onClick={() => {
      localStorage.removeItem("bdmsUser");
      window.location.href = "/";
    }}
  >
    Log Out
  </button>
</nav>

        </div>
      </header>

      {/* PAGE BODY */}
      <main className="appointments-main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="appointments-search-wrapper">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT – APPOINTMENTS + REQUESTS */}
            <div className="col-lg-8">
              <div className="appointments-card p-4 mb-4">
                <h5 className="mb-3">Appointments</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Abbas Allawati</span>
                  <span>Nov 22, 2025 , 10AM</span>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Hassan Alhasni</span>
                  <span>Nov 22, 2025 , 11AM</span>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>

                <div className="d-flex justify-content-between pb-3 mb-3 border-bottom">
                  <span className="fw-semibold">Khalid Alroshdi</span>
                  <span>Nov 22, 2025 , 12PM</span>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>

                <h6 className="mb-3">Requests</h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Jasim Albalushi</span>
                  </div>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Sara Alfarsi</span>
                  </div>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Remas Alturki</span>
                  </div>
                  <Link
                    to="/HosManRequest"
                    className="btn btn-link p-0 manage-btn"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT – IMAGE */}
            <div className="col-lg-4">
              <div className="appointments-side-top text-center mb-3">
                <img
                  src={heroImg}
                  alt="Appointments illustration"
                  className="img-fluid appointments-illustration"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="appointments-bottom-bar" />
    </div>
  );
};

export default HosAppoint;
