// src/components/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const About = () => {
  return (
    <div className="about-page">
      {/* Top hero strip (your existing navbar stays outside this) */}
      <section className="about-hero text-center text-white">
        <div className="container py-5">
          <h1 className="fw-bold mb-3">About Us</h1>
          <p className="lead mb-4">
            BDMS is a non-profit platform that connects blood donors with
            hospitals in need across Oman.  
            Our goal is to make every critical request reach the right donor at
            the right time.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <div className="badge bg-light text-danger px-3 py-2">
              🎯 Save lives faster
            </div>
            <div className="badge bg-light text-danger px-3 py-2">
              🤝 Donors &amp; hospitals together
            </div>
            <div className="badge bg-light text-danger px-3 py-2">
              📍 Focused on Oman
            </div>
          </div>
        </div>
      </section>

      {/* White content section */}
      <section className="about-content py-5">
        <div className="container">
          {/* three cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">Our Mission</h5>
                <p className="mb-0 text-muted">
                  To bridge the gap between hospitals and blood donors through a
                  simple, reliable and secure platform – ensuring that no
                  emergency is delayed due to lack of blood.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">Our Vision</h5>
                <p className="mb-0 text-muted">
                  Support Oman&apos;s 2040 health vision by building a culture
                  of regular donation, better stock management, and faster
                  response to urgent cases.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">How BDMS Helps</h5>
                <ul className="mb-0 text-muted small ps-3">
                  <li>Donors can register and manage their profiles.</li>
                  <li>Hospitals can post urgent blood requests.</li>
                  <li>
                    Blood banks can update stock and coordinate with hospitals.
                  </li>
                  <li>
                    Smart notifications help reach the right donors quickly.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact + quick links */}
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-3">Contact Info</h5>
                <p className="mb-2">
                  <span className="fw-semibold me-1">📞 Phone:</span>
                  +968 9982 9982
                </p>
                <p className="mb-2">
                  <span className="fw-semibold me-1">✉ Email:</span>
                  BDMS@gmail.com
                </p>
                <p className="mb-0">
                  <span className="fw-semibold me-1">📍 Location:</span>
                  Muscat, Oman
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="about-card text-center h-100">
                <img
                  src={bdmslogo}
                  alt="BDMS logo"
                  className="mb-3"
                  style={{ width: 90, height: 90, objectFit: "contain" }}
                />
                <h6 className="fw-semibold mb-2">Want to get involved?</h6>
                <p className="text-muted small mb-3">
                  You can register as a donor, partner with us as a hospital or
                  blood bank, or help by spreading awareness about regular blood
                  donation.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;
