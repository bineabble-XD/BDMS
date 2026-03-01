import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/11+.png";
import HospitalNavbar from "./HospitalNavbar";

const HosAppoint = () => {
  return (
    <div className="admin-app-page">
      <HospitalNavbar />

      <main className="admin-app-main">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h3 className="fw-semibold mb-1">Appointments overview</h3>
              <p className="text-muted small mb-0">
                Review upcoming donations and manage pending requests.
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

                  <span className="badge rounded-pill text-bg-light">3 total</span>
                </div>

                {[
                  { name: "Abbas Allawati", time: "Nov 22, 2025, 10:00 AM" },
                  { name: "Hassan Alhasni", time: "Nov 22, 2025, 11:00 AM" },
                  { name: "Khalid Alroshdi", time: "Nov 22, 2025, 12:00 PM" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="admin-app-row d-flex align-items-center justify-content-between py-2">
                      <div>
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">City Hospital</div>
                      </div>

                      <div className="text-muted small me-3">{item.time}</div>

                      <Link
                        to="/HosManRequest"
                        state={{ item }}
                        className="btn btn-link p-0 admin-link"
                      >
                        Manage
                      </Link>
                    </div>

                    {index < 2 && <hr className="my-1" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="admin-app-illustration mb-3">
                <img
                  src={heroImg}
                  alt="Illustration"
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

                {[
                  { name: "Jasim Albalushi", time: "Nov 24, 2025, 8:00 AM" },
                  { name: "Sara Alfarsi", time: "Nov 24, 2025, 9:00 AM" },
                  { name: "Remas Alturki", time: "Nov 24, 2025, 11:00 AM" },
                ].map((p, i) => (
                  <div key={i}>
                    <div className="admin-req-row d-flex justify-content-between align-items-center py-2">
                      <div>
                        <div className="fw-semibold small">{p.name}</div>
                        <div className="text-muted small">{p.time}</div>
                      </div>

                      <Link
                        to="/HosManRequest"
                        state={{ p }}
                        className="btn btn-link p-0 admin-link small"
                      >
                        Manage
                      </Link>
                    </div>

                    {i < 2 && <hr className="my-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default HosAppoint;
