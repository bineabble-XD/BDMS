import React from "react";
import { Link, useLocation } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const AdminNavbar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const admin = JSON.parse(localStorage.getItem("bdmsUser"));

  const displayName = admin?.fName || t("admin");

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
              <span className="text-danger">{t("brandBlood")}</span> {t("brandDonation")}
            </h5>
            <small className="text-muted">{t("brandSystem")}</small>
          </div>
        </div>

        <nav className="d-flex align-items-center gap-4">
          <Link
            className={`nav-link ${isActive("/reports")}`}
            to="/reports"
          >
            {t("navReports")}
          </Link>
          <Link
            className={`nav-link ${isActive("/admin-appointments")}`}
            to="/admin-appointments"
          >
            {t("navAppointments")}
          </Link>
          <Link
            className={`nav-link ${isActive("/dashboard")}`}
            to="/dashboard"
          >
            {t("navDashboard")}
          </Link>
          <Link
            className={`nav-link ${isActive("/NLPAssistant")}`}
            to="/NLPAssistant"
          >
            {t("navNLPAssistant")}
          </Link>
          <Link
            className={`nav-link ${isActive("/blood-bank")}`}
            to="/admin-blood-bank"
          >
            {t("navBloodBank")}
          </Link>

          <span className="nav-link mb-0 fw-bold">
            {displayName}
          </span>

          <Link
            to="/admin-profile"
            className="admin-profile-icon d-flex align-items-center justify-content-center"
            title={t("navAdminProfile")}
          >
            {displayName.charAt(0).toUpperCase()}
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm ms-2"
            onClick={handleLogout}
          >
            {t("navLogOut")}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
