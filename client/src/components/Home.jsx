// src/components/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import heroImg from "../assets/2+.png";
import bdmslogo from "../assets/bdmslogo.png";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get logged-in user from Redux
  const user = useSelector((state) => state.auth.user);

  // Safely pick a display name
  const displayName =
    user?.fName || user?.uname || user?.name || user?.email || "User";

  const handleLogout = () => {
    dispatch(logout());
    // send user back to landing page
    navigate("/");          // change to "/landing" or whatever your landing route is
  };

  return (
    <div className="home-page">
      {/* example logout usage if you want it on Home itself */}
      {/* you can also call handleLogout from your navbar instead */}
      {/* <button onClick={handleLogout} className="btn btn-outline-danger">
        Log Out
      </button> */}

      {/* HERO (no buttons here – just info for logged-in user) */}
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

      {/* ABOUT SECTION */}
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

      {/* URGENT PLACEHOLDER – later you’ll plug real data here */}
      <section id="urgent" className="urgent-section py-5 bg-light">
        <div className="container">
          <h4 className="mb-3 fw-semibold">Urgent Requests</h4>
          <p className="text-muted mb-0">
            Here we will show real-time urgent blood requests from hospitals.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
