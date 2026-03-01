import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/9+.png";
import HospitalNavbar from "./HospitalNavbar";

const HosDash = () => {
  return (
    <div className="dashboard-page">
      <HospitalNavbar />

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
