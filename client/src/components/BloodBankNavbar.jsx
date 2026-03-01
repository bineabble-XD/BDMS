import React from "react";
import { Link, useLocation } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const BloodBankNavbar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("bdmsUser"));

  const displayName = user?.fName || user?.uname || "Blood Bank";

  const handleLogout = () => {
    localStorage.removeItem("bdmsUser");
    window.location.href = "/";
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <header className="bdms-navbar shadow-sm">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-2">
          <img
            src={bdmslogo}
            alt="BDMS Logo"
            style={{
              width: "80px",
              height: "80px",
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

        <nav className="d-flex align-items-center gap-4">
          <Link
            className={`nav-link ${isActive("/inventory")}`}
            to="/inventory"
          >
            Inventory
          </Link>
          <Link
            className={`nav-link ${isActive("/community")}`}
            to="/community"
          >
            Community
          </Link>
          <Link
            className={`nav-link ${isActive("/NLPAssistant")}`}
            to="/NLPAssistant"
          >
            NLP Assistant
          </Link>

          <span className="nav-link mb-0 fw-bold">
            {displayName}
          </span>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default BloodBankNavbar;
