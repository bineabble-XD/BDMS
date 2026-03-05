import React from "react";
import { Link, useLocation } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const HospitalNavbar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const hospital = JSON.parse(localStorage.getItem("bdmsUser"));

  const displayName = hospital?.fName || t("hospital");

  const handleLogout = () => {
    localStorage.removeItem("bdmsUser");
    window.location.href = "/";
  };

  const isActive = (path) => {
    if (path === "/blood-bank") {
      return location.pathname.startsWith("/blood-bank") ? "active-link" : "";
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
            className={`nav-link ${isActive("/hospital-reports")}`}
            to="/hospital-reports"
          >
            {t("navReports")}
          </Link>
          <Link
            className={`nav-link ${isActive("/hospital-appointments")}`}
            to="/hospital-appointments"
          >
            {t("navAppointments")}
          </Link>
          <Link
            className={`nav-link ${isActive("/hospital-dash")}`}
            to="/hospital-dash"
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
            className={`nav-link ${isActive("/urgent-requests")}`}
            to="/urgent-requests"
          >
            {t("navUrgentRequests")}
          </Link>
          {(hospital?._id || hospital?.id) && (
            <Link
              className={`nav-link ${isActive("/blood-bank")}`}
              to={`/blood-bank/${hospital?._id || hospital?.id}`}
            >
              {t("navBloodBank")}
            </Link>
          )}
          <Link
            className={`nav-link ${isActive("/settings")}`}
            to="/settings"
          >
            {t("navSettings")}
          </Link>

          <span className="nav-link mb-0 fw-bold">
            {displayName}
          </span>

          <Link
            to="/HospitalProfile"
            className="admin-profile-icon d-flex align-items-center justify-content-center"
            title={t("navProfile")}
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

export default HospitalNavbar;
