// src/components/MainLayout.jsx

import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import bdmslogo from "../assets/bdmslogo.png";

const MainLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const displayName =
    user?.fName || user?.uname || user?.name || user?.email || "User";

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <div className="app-shell">
      {/* NAVBAR */}
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          {/* Logo + brand */}
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

          {/* Nav links */}
          <nav className="d-flex align-items-center gap-4">
            {/* Always available pages */}
            <Link className={`nav-link ${isActive("/home")}`} to="/home">
              Home
            </Link>
            <Link className={`nav-link ${isActive("/about")}`} to="/about">
              About Us
            </Link>
            <Link
              className={`nav-link ${isActive("/appointments")}`}
              to="/appointments"
            >
              Book An Appointment
            </Link>
            <Link
              className={`nav-link ${isActive("/urgent-requests")}`}
              to="/urgent-requests"
            >
              Urgent Requests
            </Link>

            {/* If NOT logged in – show public links */}
            {!user && (
              <>
                <Link
                  className={`nav-link ${isActive("/register")}`}
                  to="/register"
                >
                  Register Now
                </Link>
                <Link
                  className={`nav-link ${isActive("/login")}`}
                  to="/login"
                >
                  Log In
                </Link>
                <Link
                  className={`nav-link ${isActive("/community")}`}
                  to="/community"
                >
                  Community
                </Link>
                <Link
                  className={`nav-link ${isActive("/settings")}`}
                  to="/settings"
                >
                  Settings
                </Link>
              </>
            )}

            {/* If logged in – show user options */}
            {user && (
              <>
                <Link
                  className={`nav-link ${isActive("/settings")}`}
                  to="/settings"
                >
                  Settings
                </Link>

                <span className="nav-link mb-0">
                  Hi, <strong>{displayName}</strong>
                </span>

                <Link
                  to="/profile"
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center profile-icon-btn ms-1"
                  title="View Profile"
                >
                  {displayName.charAt(0).toUpperCase()}
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-light text-dark ms-2"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            )}

            {/* Search box */}
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

      {/* PAGE CONTENT */}
      <div className="page-content">
        <Outlet />
      </div>

      {/* FOOTER (optional)
      <footer className="bdms-footer text-center py-3">
        © 2025 Blood Donation Management System. All Rights Reserved.
      </footer>
      */}
    </div>
  );
};

export default MainLayout;
