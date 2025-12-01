import React from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/bdmslogo.png";

const threads = [
  {
    id: 1,
    handle: "@KhawlaHospital",
    role: "Hospital",
    title: "Urgent A- units needed tonight",
    body: "We require 6 units of A- for emergency surgery. Can any nearby blood bank confirm available stock before 9:00 PM?",
    time: "15 min ago"
  },
  {
    id: 2,
    handle: "@CentralBloodBank",
    role: "Blood Bank",
    title: "O+ stock update for Muscat region",
    body: "We can supply up to 20 units of O+ by tomorrow morning. Please send requests through official channel if needed.",
    time: "1 hr ago"
  },
  {
    id: 3,
    handle: "@RoyalHospital",
    role: "Hospital",
    title: "Scheduled drive coordination",
    body: "Looking to arrange a joint blood drive next Thursday. Any blood banks interested in partnering and sharing mobile units?",
    time: "3 hrs ago"
  },
  {
    id: 4,
    handle: "@SalalahBloodCenter",
    role: "Blood Bank",
    title: "Low B- stock warning",
    body: "Our B- stock is under safety threshold. Requesting hospitals to prioritize usage and share available units if possible.",
    time: "6 hrs ago"
  },
  {
    id: 5,
    handle: "@NizwaHospital",
    role: "Hospital",
    title: "Cross-match confirmation",
    body: "Need confirmation for cross-match results for patient ID #BD-2391. Please respond in the thread if results were shared.",
    time: "8 hrs ago"
  },
  {
    id: 6,
    handle: "@SeebBloodBank",
    role: "Blood Bank",
    title: "New donor registration day",
    body: "We’re organizing a donor day on 5 Dec. Hospitals can share priority blood types so we can focus on those during the event.",
    time: "Yesterday"
  }
];

const Community = () => {
  return (
    <div className="community-page">
      {/* NAVBAR – same BDMS style */}
      <header className="bdms-navbar shadow-sm community-navbar">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "12px",
                objectFit: "cover"
              }}
            />
            <div className="lh-1 text-white">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> DONATION
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/home" className="nav-link text-white">
              Home
            </Link>
            <span className="nav-link fw-bold text-danger">Community</span>
            <Link to="/appointments" className="nav-link text-white">
              Appointments
            </Link>
            <Link to="/reports" className="nav-link text-white">
              Reports
            </Link>

            {/* simple logout – you can wire it to Redux if you want */}
            <button
              className="btn btn-outline-light ms-3"
              onClick={() => (window.location.href = "/home")}
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN FEED */}
      <main className="community-main py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white fw-bold mb-0">Blood Bank Community</h2>
            <button className="btn btn-danger px-4">
              + New Post
            </button>
          </div>

          <p className="mb-4">
            A shared space for hospitals and blood banks to coordinate urgent
            requests, stock updates and donation drives.
          </p>

          <div className="row g-4">
            {threads.map((t) => (
              <div key={t.id} className="col-md-4">
                <article className="community-card h-100 d-flex flex-column">
                  {/* card header */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="community-avatar me-3">
                      {t.handle.charAt(1).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white fw-semibold small">
                        {t.handle}
                      </div>
                      <div className="community-role-badge">
                        {t.role}
                      </div>
                    </div>
                  </div>

                  {/* main text */}
                  <h6 className="text-white fw-semibold mb-2">
                    {t.title}
                  </h6>
                  <p className="text-muted small flex-grow-1">
                    {t.body}
                  </p>

                  {/* footer actions */}
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                    <span className="text-muted small">{t.time}</span>
                    <div className="d-flex gap-3">
                      <button className="community-icon-btn" type="button">
                        👍 <span className="small">Acknowledge</span>
                      </button>
                      <button className="community-icon-btn" type="button">
                        💬 <span className="small">Reply</span>
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
