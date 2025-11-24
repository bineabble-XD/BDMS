import React from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";  // Make sure this is the correct path to your logo
import heroImg from "../assets/2.png";   // Hero image path for the dashboard illustration

const HosAppoint = () => {
  return (
    <div className="appointments-page">
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
            <Link to="/reports" className="nav-link">
              Reports
            </Link>
            <span className="nav-link active-link">Appointments</span>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <span className="nav-link">BDMS ADMIN</span>
          </nav>
        </div>
      </header>

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
            <div className="col-lg-8">
              <div className="appointments-card p-4 mb-4">
                <h5 className="mb-3">Appointments</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Abbas Allawati</span>
                  <span>Nov 22, 2025 , 10AM</span>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">Hassan Alhasni</span>
                  <span>Nov 22, 2025 , 11AM</span>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>

                <div className="d-flex justify-content-between pb-3 mb-3 border-bottom">
                  <span className="fw-semibold">Khalid Alroshdi</span>
                  <span>Nov 22, 2025 , 12PM</span>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>

                <h6 className="mb-3">Requests</h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Jasim Albalushi</span>
                  </div>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Sara Alfarsi</span>
                  </div>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Remas Alturki</span>
                  </div>
                  <button className="btn btn-link p-0 manage-btn">Manage</button>
                </div>
              </div>
            </div>

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
