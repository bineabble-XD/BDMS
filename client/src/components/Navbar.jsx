import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const user = useSelector((state) => state.auth.user);

  const displayName =
    user?.fName || user?.uname || user?.name || user?.email || t("user");

  const handleLogout = () => {
    dispatch(logout());
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
              <span className="text-danger">{t("brandBlood")}</span> {t("brandDonation")}
            </h5>
            <small className="text-muted">{t("brandSystem")}</small>
          </div>
        </div>

        <nav className="d-flex align-items-center gap-4">
          {!user ? (
            <>
              <Link className={`nav-link ${isActive("/home")}`} to="/home">
                {t("navHome")}
              </Link>
              <Link className={`nav-link ${isActive("/about")}`} to="/about">
                {t("navAbout")}
              </Link>
              <Link
                className={`nav-link ${isActive("/login")}`}
                to="/login"
              >
                {t("navLogin")}
              </Link>
              <Link
                className={`nav-link ${isActive("/register")}`}
                to="/register"
              >
                {t("navRegister")}
              </Link>
              <Link
                className={`nav-link ${isActive("/settings")}`}
                to="/settings"
              >
                {t("navSettings")}
              </Link>
            </>
          ) : (
            <>
              <Link className={`nav-link ${isActive("/home")}`} to="/home">
                {t("navHome")}
              </Link>
              <Link className={`nav-link ${isActive("/about")}`} to="/about">
                {t("navAbout")}
              </Link>
              <Link
                className={`nav-link ${isActive("/appointments")}`}
                to="/appointments"
              >
                {t("navBookAppointment")}
              </Link>
              <Link
                className={`nav-link ${isActive("/urgent-requests")}`}
                to="/urgent-requests"
              >
                {t("navUrgentRequests")}
              </Link>
              <Link
                className={`nav-link ${isActive("/settings")}`}
                to="/settings"
              >
                {t("navSettings")}
              </Link>

              <span className="nav-link mb-0">
                {t("navHi")}, <strong>{displayName}</strong>
              </span>

              <Link
                to="/profile"
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center profile-icon-btn ms-1"
                title={t("navViewProfile")}
              >
                {displayName.charAt(0).toUpperCase()}
              </Link>

              <button
                type="button"
                className="btn btn-outline-light text-dark ms-2"
                onClick={handleLogout}
              >
                {t("navLogOut")}
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
