import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const About = () => {
  return (
    <div className="about-page">
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
                <span className="text-danger">BLOOD</span>{" "}
                <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link active-link">
              About Us
            </Link>
            <a href="#urgent" className="nav-link">
              Urgent Requests
            </a>
            <Link to="/register" className="nav-link">
              Register Now
            </Link>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
          </nav>
        </div>
      </header>

      <section className="about-hero">
        <div className="container text-center">
          <h1 className="about-title mb-3">
            About <span>Us</span>
          </h1>
          <p className="about-text mb-4">
            BDMS is a non profit platform connecting blood donors with hospitals
            in need across Oman.
          </p>

          <h5 className="mb-3">Contact Info</h5>

          <div className="about-contact d-flex flex-wrap justify-content-center gap-4">
            <div className="d-flex align-items-center gap-2">
              <span>+968 9982 9982</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>BDMS@gmail.com</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>Muscat</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
