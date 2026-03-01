import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/11+.png";
import AdminNavbar from "./AdminNavbar";

const AdminAppoint = () => {
  return (
    <div className="admin-app-page">
      <AdminNavbar />

      <main className="admin-app-main">
        <div className="container">
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
