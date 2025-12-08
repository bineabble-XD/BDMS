// src/components/AdminAppoint.jsx
import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import heroImg from "../assets/11+.png";

const AdminAppoint = () => {
  return (
    <div className="admin-app-page">
      {/* NAVBAR */}
      <header className="bdms-navbar shadow-sm">
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
                <span className="text-danger">BLOOD</span> DONATION
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
          {/* Page heading + search */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h3 className="fw-semibold mb-1">Appointments overview</h3>
              <p className="text-muted small mb-0">
                Review today&apos;s booked donations and manage incoming
                requests.
              </p>
            </div>

            
          </div>

          <div className="row g-4">
            {/* LEFT – APPOINTMENTS LIST */}
            <div className="col-lg-8">
              <div className="admin-app-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1">Appointments</h5>
                    <span className="text-muted small">
                      Scheduled donations for <strong>Nov 22, 2025</strong>
                    </span>
                  </div>
                  <span className="badge rounded-pill text-bg-light">
                    3 booked
                  </span>
                </div>

                {/* Abbas */}
                <div className="admin-app-row d-flex align-items-center justify-content-between py-2">
                  <div>
                    <div className="fw-semibold">Abbas Allawati</div>
                    <div className="text-muted small">Khawla Hospital</div>
                  </div>
                  <div className="text-muted small me-3">
                    Nov 22, 2025, 10:00 AM
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "appointment",
                      request: {
                        name: "Abbas Allawati",
                        donorType: "O+",
                        requested: "Nov 22, 2025, 10:00 AM",
                        reason:
                          "Routine blood donation appointment as per schedule.",
                        ageGender: "24 – Male",
                        email: "abbas@example.com",
                        phone: "+968 99990001",
                        eligible: true,
                        previousDate: "Aug 12, 2025",
                        previousHospital: "City Hospital",
                      },
                    }}
                    className="btn btn-link p-0 admin-link"
                  >
                    View &gt;
                  </Link>
                </div>

                <hr className="my-1" />

                {/* Hassan */}
                <div className="admin-app-row d-flex align-items-center justify-content-between py-2">
                  <div>
                    <div className="fw-semibold">Hassan Alhasni</div>
                    <div className="text-muted small">Royal Hospital</div>
                  </div>
                  <div className="text-muted small me-3">
                    Nov 22, 2025, 11:00 AM
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "appointment",
                      request: {
                        name: "Hassan Alhasni",
                        donorType: "A+",
                        requested: "Nov 22, 2025, 11:00 AM",
                        reason: "Requested to donate for hospital blood drive.",
                        ageGender: "27 – Male",
                        email: "hassan@example.com",
                        phone: "+968 99990002",
                        eligible: true,
                        previousDate: "Sep 05, 2025",
                        previousHospital: "Royal Hospital",
                      },
                    }}
                    className="btn btn-link p-0 admin-link"
                  >
                    View &gt;
                  </Link>
                </div>

                <hr className="my-1" />

                {/* Khalid */}
                <div className="admin-app-row d-flex align-items-center justify-content-between py-2">
                  <div>
                    <div className="fw-semibold">Khalid Alroshdi</div>
                    <div className="text-muted small">Star Hospital</div>
                  </div>
                  <div className="text-muted small me-3">
                    Nov 22, 2025, 12:00 PM
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "appointment",
                      request: {
                        name: "Khalid Alroshdi",
                        donorType: "B+",
                        requested: "Nov 22, 2025, 12:00 PM",
                        reason:
                          "Follow-up appointment after previous successful donation.",
                        ageGender: "29 – Male",
                        email: "khalid@example.com",
                        phone: "+968 99990003",
                        eligible: false,
                        previousDate: "Jun 18, 2025",
                        previousHospital: "Star Hospital",
                      },
                    }}
                    className="btn btn-link p-0 admin-link"
                  >
                    View &gt;
                  </Link>
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Pending requests</h6>
                  <span className="badge rounded-pill text-bg-danger-subtle">
                    3 pending
                  </span>
                </div>

                {/* Jasim */}
                <div className="admin-req-row d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold small">Jasim Albalushi</div>
                    <div className="text-muted small">
                      Nov 24, 2025, 8:00 AM
                    </div>
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "request",
                      request: {
                        name: "Jasim Albalushi",
                        donorType: "O+",
                        requested: "Nov 24, 2025, 8:00 AM",
                        reason:
                          "Scheduled follow-up donation as per previous visit.",
                        ageGender: "23 – Male",
                        email: "jasim@gmail.com",
                        phone: "+968 99998881",
                        eligible: true,
                        previousDate: "Aug 01, 2025",
                        previousHospital: "Royal Hospital",
                      },
                    }}
                    className="btn btn-link p-0 admin-link small"
                  >
                    Manage
                  </Link>
                </div>

                <hr className="my-1" />

                {/* Sara */}
                <div className="admin-req-row d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold small">Sara Alfarsi</div>
                    <div className="text-muted small">
                      Nov 24, 2025, 9:00 AM
                    </div>
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "request",
                      request: {
                        name: "Sara Alfarsi",
                        donorType: "A-",
                        requested: "Nov 24, 2025, 9:00 AM",
                        reason:
                          "First-time donation after recent awareness campaign.",
                        ageGender: "21 – Female",
                        email: "sara.alfarsi@example.com",
                        phone: "+968 99998882",
                        eligible: true,
                        previousDate: "—",
                        previousHospital: "No previous donations",
                      },
                    }}
                    className="btn btn-link p-0 admin-link small"
                  >
                    Manage
                  </Link>
                </div>

                <hr className="my-1" />

                {/* Remas */}
                <div className="admin-req-row d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold small">Remas Alturki</div>
                    <div className="text-muted small">
                      Nov 24, 2025, 11:00 AM
                    </div>
                  </div>
                  <Link
                    to="/AdminManRequest"
                    state={{
                      context: "request",
                      request: {
                        name: "Remas Alturki",
                        donorType: "B+",
                        requested: "Nov 24, 2025, 11:00 AM",
                        reason:
                          "Requested to donate for scheduled hospital surgery.",
                        ageGender: "26 – Female",
                        email: "remas.alturki@example.com",
                        phone: "+968 99998883",
                        eligible: false,
                        previousDate: "Jun 10, 2025",
                        previousHospital: "Khawla Hospital",
                      },
                    }}
                    className="btn btn-link p-0 admin-link small"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppoint;
