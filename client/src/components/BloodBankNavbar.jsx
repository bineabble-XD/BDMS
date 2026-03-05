import React from "react";
import { Link, useLocation } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const BloodBankNavbar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const user = JSON.parse(localStorage.getItem("bdmsUser"));

  const displayName = user?.fName || user?.uname || t("bloodBank");

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
              <span className="text-danger">{t("brandBlood")}</span> {t("brandDonation")}
            </h5>
            <small className="text-muted">{t("brandSystem")}</small>
          </div>
        </div>

        <nav className="d-flex align-items-center gap-4">
          <Link
            className={`nav-link ${isActive("/inventory")}`}
            to="/inventory"
          >
            {t("navInventory")}
          </Link>
          <Link
            className={`nav-link ${isActive("/community")}`}
            to="/community"
          >
            {t("navCommunity")}
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
          <Link
            className={`nav-link ${isActive("/settings")}`}
            to="/settings"
          >
            {t("navSettings")}
          </Link>

          <span className="nav-link mb-0 fw-bold">
            {displayName}
          </span>

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

export default BloodBankNavbar;
