import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/2.png";
import bdmslogo from "../assets/bdmslogo.png";

const LandingPage = () => {
  return (
    <div className="home-page">
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
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <a href="#hero" className="nav-link active-link">
              Home
            </a>
            <Link to="/about" className="nav-link">
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

            <form className="d-flex ms-3 search-box">
              <input
                type="search"
                className="form-control form-control-sm"
                placeholder="Search"
              />
              <button className="btn btn-sm btn-light ms-1" type="submit">
                🔍
              </button>
            </form>
          </nav>
        </div>
      </header>

      <section id="hero" className="hero-section">
        <div className="container h-100">
          <div className="row align-items-center h-100">
            <div className="col-md-6 mb-4 mb-md-0">
              <p className="hero-tagline mb-2">Donate blood • Save lives</p>
              <h1 className="hero-title mb-3">
                <span>Save Life</span> <br />
                <span>Donate Blood</span>
              </h1>
              <p className="hero-text mb-4">
                Donate blood and be a hero – your generosity can save lives.
                Join a proud tradition that has made a difference for centuries.
                Make an impact today with a simple, lifesaving act.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/register" className="btn btn-light fw-semibold">
                  Become a Donor
                </Link>
                <a href="#urgent" className="btn btn-outline-light">
                  View Urgent Requests
                </a>
              </div>
            </div>

            <div className="col-md-6 text-center">
              <img
                src={heroImg}
                alt="Blood donation illustration"
                className="img-fluid hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section py-5">
        <div className="container">
          <h3 className="mb-3 fw-semibold">About</h3>
          <p className="lead mb-3">
            Our goal is to make blood donation easier by linking donors to
            hospitals and aligning with Oman&apos;s 2040 Vision for health and
            well-being.
          </p>
          <p className="text-muted mb-0">
            Through this Blood Donation Management System, we aim to provide a
            simple and efficient platform where donors, hospitals, and
            recipients can connect quickly in times of need. Your single
            donation can be the reason someone gets a second chance at life.
          </p>
        </div>
      </section>

      <section id="urgent" className="urgent-section py-5 bg-light">
        <div className="container">
          <h4 className="mb-3 fw-semibold">Urgent Requests</h4>
          <p className="text-muted mb-0">
            Here you can later show real-time urgent blood requests from
            hospitals. For now, this is a placeholder section.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
