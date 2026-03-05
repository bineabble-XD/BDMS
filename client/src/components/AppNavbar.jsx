import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const LOGO_SIZE = 80;

const getUser = () => JSON.parse(localStorage.getItem("bdmsUser") || "null");

const AppNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const reduxUser = useSelector((state) => state.auth.user);

  const [storedUser, setStoredUser] = useState(getUser);
  useEffect(() => {
    setStoredUser(getUser());
    const onStorage = () => setStoredUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location.pathname]);

  const user = storedUser || reduxUser;

  const isAdmin = user?.isAdmin === true || user?.role === "Admin" || user?.role === "admin";
  const isHospital = user?.isHospital === true || user?.role === "Hospital" || user?.role === "hospital";
  const isBloodBank = user?.role === "Blood Bank" || user?.role === "blood bank";

  const displayName =
    user?.fName || user?.uname || user?.name || user?.email ||
    (isAdmin ? t("admin") : isHospital ? t("hospital") : isBloodBank ? t("bloodBank") : t("user"));

  const handleLogout = () => {
    localStorage.removeItem("bdmsUser");
    dispatch(logout());
    window.location.href = "/";
  };

  const isActive = (path, prefixMatch = false) => {
    if (prefixMatch) return location.pathname.startsWith(path) ? "active-link" : "";
    return location.pathname === path ? "active-link" : "";
  };

  const navLink = (to, label, prefix = false) => (
    <Link key={to} className={`nav-link ${isActive(to, prefix)}`} to={to}>
      {label}
    </Link>
  );

  const brandSection = (
    <div className="d-flex align-items-center gap-2">
      <img
        src={bdmslogo}
        alt="BDMS Logo"
        style={{
          width: LOGO_SIZE,
          height: LOGO_SIZE,
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
  );

  const profileIcon = (profileTo, title) => (
    <Link
      to={profileTo}
      className="admin-profile-icon d-flex align-items-center justify-content-center"
      title={title}
    >
      {displayName.charAt(0).toUpperCase()}
    </Link>
  );

  const logoutBtn = (
    <button
      type="button"
      className="btn btn-outline-danger btn-sm ms-2"
      onClick={handleLogout}
    >
      {t("navLogOut")}
    </button>
  );

  const renderNavLinks = () => {
    if (isAdmin) {
      return (
        <>
          {navLink("/reports", t("navReports"))}
          {navLink("/admin-appointments", t("navAppointments"))}
          {navLink("/dashboard", t("navDashboard"))}
          {navLink("/admin-blood-bank", t("navBloodBank"))}
          {navLink("/inventory", t("navInventory"))}
          {navLink("/community", t("navCommunity"))}
          {navLink("/NLPAssistant", t("navNLPAssistant"))}
          {navLink("/settings", t("navSettings"))}
          <span className="nav-link mb-0 fw-bold">{displayName}</span>
          {profileIcon("/admin-profile", t("navAdminProfile"))}
          {logoutBtn}
        </>
      );
    }

    if (isHospital) {
      const hospitalId = user?._id || user?.id;
      return (
        <>
          {navLink("/hospital-reports", t("navReports"))}
          {navLink("/hospital-appointments", t("navAppointments"))}
          {navLink("/hospital-dash", t("navDashboard"))}
          {hospitalId && navLink(`/blood-bank/${hospitalId}`, t("navBloodBank"), true)}
          {navLink("/inventory", t("navInventory"))}
          {navLink("/community", t("navCommunity"))}
          {navLink("/NLPAssistant", t("navNLPAssistant"))}
          {navLink("/settings", t("navSettings"))}
          <span className="nav-link mb-0 fw-bold">{displayName}</span>
          {profileIcon("/HospitalProfile", t("navProfile"))}
          {logoutBtn}
        </>
      );
    }

    if (isBloodBank) {
      return (
        <>
          {navLink("/inventory", t("navInventory"))}
          {navLink("/community", t("navCommunity"))}
          {navLink("/NLPAssistant", t("navNLPAssistant"))}
          {navLink("/settings", t("navSettings"))}
          <span className="nav-link mb-0 fw-bold">{displayName}</span>
          {profileIcon("/profile", t("navProfile"))}
          {logoutBtn}
        </>
      );
    }

    if (user) {
      return (
        <>
          {navLink("/home", t("navHome"))}
          {navLink("/about", t("navAbout"))}
          {navLink("/appointments", t("navBookAppointment"))}
          {navLink("/my-appointments", t("navMyAppointments"))}
          {navLink("/urgent-requests", t("navUrgentRequests"))}
          {navLink("/feedback", t("navFeedback"))}
          {navLink("/settings", t("navSettings"))}
          <span className="nav-link mb-0">
            {t("navHi")}, <strong>{displayName}</strong>
          </span>
          {profileIcon("/profile", t("navViewProfile"))}
          {logoutBtn}
        </>
      );
    }

    return (
      <>
        {navLink("/home", t("navHome"))}
        {navLink("/about", t("navAbout"))}
        {navLink("/urgent-requests", t("navUrgentRequests"))}
        {navLink("/feedback", t("navFeedback"))}
        {navLink("/login", t("navLogin"))}
        {navLink("/register", t("navRegister"))}
        {navLink("/settings", t("navSettings"))}
      </>
    );
  };

  return (
    <header className="bdms-navbar shadow-sm">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <Link to={user ? (isAdmin ? "/dashboard" : isHospital ? "/hospital-dash" : isBloodBank ? "/inventory" : "/home") : "/"} className="text-decoration-none text-body">
          {brandSection}
        </Link>
        <nav className="d-flex align-items-center gap-4 flex-wrap">
          {renderNavLinks()}
        </nav>
      </div>
    </header>
  );
};

export default AppNavbar;
