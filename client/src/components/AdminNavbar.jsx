import React from "react";
import { Link, useLocation } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const AdminNavbar = () => {
  const location = useLocation();
  const admin = JSON.parse(localStorage.getItem("bdmsUser"));

  const displayName = admin?.fName || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("bdmsUser");
    window.location.href = "/";
  };

  const isActive = (path) => {
    if (path === "/blood-bank") {
      return location.pathname.startsWith("/admin-blood-bank") ? "active-link" : "";
    }
    return location.pathname === path ? "active-link" : "";
  };

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
            className={`nav-link ${isActive("/reports")}`}
            to="/reports"
          >
            Reports
          </Link>
          <Link
            className={`nav-link ${isActive("/admin-appointments")}`}
            to="/admin-appointments"
          >
            Appointments
          </Link>
          <Link
            className={`nav-link ${isActive("/dashboard")}`}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={`nav-link ${isActive("/NLPAssistant")}`}
            to="/NLPAssistant"
          >
            NLP Assistant
          </Link>
          <Link
            className={`nav-link ${isActive("/blood-bank")}`}
            to="/admin-blood-bank"
          >
            Blood Bank
          </Link>

          <span className="nav-link mb-0 fw-bold">
            {displayName}
          </span>

          <Link
            to="/admin-profile"
            className="admin-profile-icon d-flex align-items-center justify-content-center"
            title="Admin Profile"
          >
            {displayName.charAt(0).toUpperCase()}
          </Link>

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

export default AdminNavbar;
