import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/2+.png";
import bdmslogo from "../assets/bdmslogo.png";
import SocialFeed from "./SocialFeed.jsx";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ChatbotWidget from "./ChatbotWidget.jsx";

const LandingPage = () => {
  return (
    <div className="home-page">
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
                <Link to="/urgent-requests" className="btn btn-outline-light">
                  View Urgent Requests
                </Link>
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
          <SocialFeed />
        </div>
      </section>
      <section className="social-section py-4 text-center">
        <div className="container">
          <h4 className="mb-3">Follow BDMS</h4>

          <div
            style={{ display: "flex", justifyContent: "center", gap: "25px" }}
          >
            <a
              href="https://www.instagram.com/bdmstech?igsh=MWI1b3U1cjdqeGp1dw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={35} color="#E1306C" />
            </a>

            <a
              href="https://x.com/bdmsoman?s=21"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter size={35} />
            </a>
          </div>
        </div>
      </section>
      <ChatbotWidget />
    </div>
  );
};

export default LandingPage;
