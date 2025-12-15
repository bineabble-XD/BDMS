import React from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/bdmslogo.png";
import heroImg from "../assets/9+.png";

const hospital = JSON.parse(localStorage.getItem("bdmsUser"));

const HosDash = () => {
  return (
    <div className="dashboard-page">
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
            <Link to="/hospital-reports" className="nav-link">
              Reports
            </Link>

            <Link to="/hospital-appointments" className="nav-link">
              Appointments
            </Link>

            <span className="nav-link active-link">Dashboard</span>

            <span className="nav-link fw-bold">
              {hospital?.fName || "Hospital Page"}
            </span>

            <Link
              to="/HospitalProfile" 
              className="admin-profile-icon d-flex align-items-center justify-content-center"
              title="Profile"
            >
              {hospital?.fName?.charAt(0).toUpperCase() || "H"}
            </Link>

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

      <main className="dashboard-main">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="dashboard-card p-4 mb-4">
                <h5 className="mb-3">Last Donations</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">City Hospital</span>
                  <span>Nov 11, 2025 , 10:00 AM</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">City Hospital</span>
                  <span>Nov 11, 2025 , 9:40 AM</span>
                </div>
                <div className="d-flex justify-content-between pb-3 mb-3 border-bottom">
                  <span className="fw-semibold">Star Hospital</span>
                  <span>Nov 10, 2025 , 8:00 PM</span>
                </div>

                <h6 className="mb-3">Urgent Requests</h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>City Hospital</span>
                  </div>
                  <Link
                    to="/urgent-requests"
                    className="btn btn-link p-0 dashboard-view-link"
                  >
                    View &gt;
                  </Link>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Star Hospital</span>
                  </div>
                  <Link
                    to="/urgent-requests"
                    className="btn btn-link p-0 dashboard-view-link"
                  >
                    View &gt;
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dashboard-side-top text-center mb-3">
                <img
                  src={heroImg}
                  alt="Dashboard illustration"
                  className="img-fluid dashboard-illustration"
                />
              </div>

              <div className="dashboard-side-card p-3">
                <h6 className="mb-3 text-center">Appointments</h6>

                <div className="d-flex justify-content-between mb-2">
                  <span>Abbas Allawati</span>
                  <span>Nov 22, 2025, 10AM</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Hassan Alhasni</span>
                  <span>Nov 22, 2025, 11AM</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Khalid Alroshdi</span>
                  <span>Nov 22, 2025, 12PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HosDash;
