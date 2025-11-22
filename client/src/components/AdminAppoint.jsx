import React from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";
import heroImg from "../assets/2.png";

const AdminAppoint = () => {
  return (
    <div className="admin-app-page">
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

      {/* MAIN CONTENT */}
      <main className="admin-app-main">
        <div className="container">
          {/* search */}
          <div className="d-flex justify-content-start mb-3">
            <div className="admin-search-wrapper">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
              />
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT – APPOINTMENTS LIST */}
            <div className="col-lg-8">
              <div className="admin-app-card p-4">
                <h5 className="mb-4">Appointments</h5>

                <div className="admin-app-row">
                  <span className="fw-semibold">Abbas Allawati</span>
                  <span>Nov 22, 2025, 10AM</span>
                  <button className="btn btn-link p-0 admin-link">
                    View &gt;
                  </button>
                </div>

                <hr className="my-2" />

                <div className="admin-app-row">
                  <span className="fw-semibold">Hassan Alhasni</span>
                  <span>Nov 22, 2025, 11AM</span>
                  <button className="btn btn-link p-0 admin-link">
                    View &gt;
                  </button>
                </div>

                <hr className="my-2" />

                <div className="admin-app-row">
                  <span className="fw-semibold">Khalid Alroshdi</span>
                  <span>Nov 22, 2025, 12PM</span>
                  <button className="btn btn-link p-0 admin-link">
                    View &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT – IMAGE + REQUESTS CARD */}
            <div className="col-lg-4">
              <div className="admin-app-illustration text-center mb-3">
                <img
                  src={heroImg}
                  alt="Admin illustration"
                  className="img-fluid admin-app-img"
                />
              </div>

              <div className="admin-requests-card p-3">
                <h6 className="mb-3 text-center">Requests</h6>

                <div className="admin-req-row">
                  <span>Jasim Albalushi</span>
                  <span>Nov 24, 2025, 8AM</span>
                </div>
                <div className="text-end mb-3">
                  <button className="btn btn-link p-0 admin-link">
                    Manage
                  </button>
                </div>

                <hr className="my-1" />

                <div className="admin-req-row">
                  <span>Sara Alfarsi</span>
                  <span>Nov 24, 2025, 9AM</span>
                </div>
                <div className="text-end mb-3">
                  <button className="btn btn-link p-0 admin-link">
                    Manage
                  </button>
                </div>

                <hr className="my-1" />

                <div className="admin-req-row">
                  <span>Remas Alturki</span>
                  <span>Nov 24, 2025, 11AM</span>
                </div>
                <div className="text-end">
                  <button className="btn btn-link p-0 admin-link">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* bottom red bar */}
      <div className="admin-bottom-bar" />
    </div>
  );
};

export default AdminAppoint;
