import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiBell } from "react-icons/fi";
import { logout } from "../features/authSlice";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const LOGO_SIZE = 80;
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatNotifDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const now = new Date();
  const today = now.toDateString();
  const dateStr = dt.toDateString();
  const time = dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Muscat" });
  if (dateStr === today) return `Today at ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === tomorrow.toDateString()) return `Tomorrow at ${time}`;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Muscat" });
};

const getUser = () => JSON.parse(localStorage.getItem("bdmsUser") || "null");

const AppNavbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const reduxUser = useSelector((state) => state.auth.user);

  const [storedUser, setStoredUser] = useState(getUser);
  const [reminders, setReminders] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [hospitalDetailsModal, setHospitalDetailsModal] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => {
    setStoredUser(getUser());
    const onStorage = () => setStoredUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location.pathname]);

  const user = storedUser || reduxUser;
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchReminders = async () => {
      if (!userId) {
        setReminders([]);
        return;
      }
      try {
        const isDonor = !user?.isAdmin && !user?.isHospital && !user?.isInventory && ((user?.role || "").toLowerCase() === "donor" || !user?.role);
        if (isDonor) {
          const [bookingsRes, urgentRes] = await Promise.all([
            fetch(`${API_BASE}/bookings/donor/${userId}`),
            fetch(`${API_BASE}/urgent-requests/matching/${userId}`),
          ]);
          const bookingsData = await bookingsRes.json();
          const urgentData = await urgentRes.json();
          const allBookings = bookingsData?.bookings || [];
          const upcoming = allBookings.filter(
            (b) =>
              (b.status || "").toLowerCase() === "approved" &&
              new Date(b.appointmentDate) >= new Date()
          );
          const urgentRequests = (urgentData?.requests || []).map((ur) => ({ ...ur, _type: "urgent" }));
          const combined = [...urgentRequests, ...upcoming.map((b) => ({ ...b, _type: "appointment" }))];
          setReminders(combined.slice(0, 8));
        } else if (user?.isHospital) {
          const res = await fetch(`${API_BASE}/bookings/hospital/${userId}`);
          const data = await res.json();
          const pending = data?.pending || [];
          const appointments = data?.appointments || [];
          const combined = [...pending.map((b) => ({ ...b, _type: "pending" })), ...appointments.map((b) => ({ ...b, _type: "upcoming" }))];
          setReminders(combined.slice(0, 5));
        } else {
          setReminders([]);
        }
      } catch {
        setReminders([]);
      }
    };
    fetchReminders();
  }, [userId, user?.isAdmin, user?.isHospital, user?.role, location.pathname]);

  useEffect(() => {
    const onDown = (e) => {
      if (!notifOpen) return;
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [notifOpen]);

  const isAdmin = user?.isAdmin === true || user?.role === "Admin" || user?.role === "admin";
  const isHospital = user?.isHospital === true || user?.role === "Hospital" || user?.role === "hospital";
  const isBloodBank = user?.role === "Blood Bank" || user?.role === "blood bank" || user?.isInventory === true;

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

  const isDonor = !isAdmin && !isHospital && !isBloodBank;
  const showBell = user && (isHospital || isDonor);

  const notificationBell = showBell && (
    <div className="nav-notif-wrap" ref={notifRef}>
      <button
        type="button"
        className="nav-notif-btn"
        onClick={() => setNotifOpen((o) => !o)}
        aria-label={t("navNotifications") || "Notifications"}
      >
        <FiBell size={20} />
        {reminders.length > 0 && (
          <span className="nav-notif-badge">{reminders.length > 9 ? "9+" : reminders.length}</span>
        )}
      </button>
      {notifOpen && (
        <div className="nav-notif-dropdown">
          <div className="nav-notif-header">{t("navNotifications") || "Notifications"}</div>
          {reminders.length === 0 ? (
            <div className="nav-notif-empty">
              {isHospital
                ? (t("navNotifNoPending") || "No pending approvals or upcoming appointments.")
                : (t("navNotifNoUpcoming") || "No upcoming appointments.")}
            </div>
          ) : (
            <div className="nav-notif-list">
              {reminders.map((r) => {
                const isUrgent = r._type === "urgent";
                const to = isUrgent ? "/urgent-requests" : (isHospital ? "/hospital-dash" : "/my-appointments");
                return (
                  <div key={r._id} className="nav-notif-item-wrap">
                    <Link
                      to={to}
                      className="nav-notif-item"
                      onClick={() => setNotifOpen(false)}
                    >
                      <div className="nav-notif-item-title">
                        {isUrgent ? (
                          <>
                            <span className="badge bg-danger me-1">{t("navNotifUrgent") || "Urgent"}</span>
                            {r.hospital?.hospitalName || "Hospital"} {t("navNotifNeeds") || "needs"} {r.bloodType}
                          </>
                        ) : (
                          <>
                            {r.hospital?.hospitalName || "Hospital"}
                            {r._type === "pending" && <span className="badge bg-warning text-dark ms-1">Pending</span>}
                          </>
                        )}
                      </div>
                      <div className="nav-notif-item-date">
                        {isUrgent ? (r.createdAt ? formatNotifDate(r.createdAt) : "") : formatNotifDate(r.appointmentDate)}
                      </div>
                      {!isHospital && !isUrgent && <div className="nav-notif-item-meta">{r.bloodType}</div>}
                      {!isHospital && isUrgent && <div className="nav-notif-item-meta">{t("navNotifYourBloodType") || "Matches your blood type"}</div>}
                    </Link>
                    {!isHospital && r.hospital && (
                      <button
                        type="button"
                        className="nav-notif-details-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setHospitalDetailsModal(r.hospital);
                        }}
                      >
                        {t("navNotifDetails") || "Details"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <Link
            to={isHospital ? "/hospital-dash" : "/my-appointments"}
            className="nav-notif-footer"
            onClick={() => setNotifOpen(false)}
          >
            {t("navViewAll") || "View all"}
          </Link>
        </div>
      )}

      {hospitalDetailsModal && (
        <div
          className="nav-notif-modal-backdrop"
          onClick={() => setHospitalDetailsModal(null)}
        >
          <div
            className="nav-notif-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nav-notif-modal-header">
              <h6 className="nav-notif-modal-title mb-0">
                {hospitalDetailsModal.hospitalName || t("navNotifHospitalDetails") || "Hospital Details"}
              </h6>
              <button
                type="button"
                className="btn-close btn-close-sm"
                aria-label="Close"
                onClick={() => setHospitalDetailsModal(null)}
              />
            </div>
            <div className="nav-notif-modal-body">
              <div className="mb-2">
                <strong>{t("navNotifHospital") || "Hospital"}:</strong> {hospitalDetailsModal.hospitalName || "—"}
              </div>
              {hospitalDetailsModal.city && (
                <div className="mb-2">
                  <strong>{t("navNotifCity") || "City"}:</strong> {hospitalDetailsModal.city}
                </div>
              )}
              <div className="mb-2">
                <strong>{t("navNotifContactPerson") || "Contact Person"}:</strong> {hospitalDetailsModal.contactPerson || "—"}
              </div>
              {hospitalDetailsModal.contactPhone && (
                <div className="mb-2">
                  <strong>{t("navNotifPhone") || "Phone"}:</strong>{" "}
                  <a href={`tel:${hospitalDetailsModal.contactPhone}`}>{hospitalDetailsModal.contactPhone}</a>
                </div>
              )}
              {hospitalDetailsModal.contactEmail && (
                <div className="mb-2">
                  <strong>{t("navNotifEmail") || "Email"}:</strong>{" "}
                  <a href={`mailto:${hospitalDetailsModal.contactEmail}`}>{hospitalDetailsModal.contactEmail}</a>
                </div>
              )}
            </div>
            <div className="nav-notif-modal-footer">
              {hospitalDetailsModal.contactPhone && (
                <a href={`tel:${hospitalDetailsModal.contactPhone}`} className="btn btn-danger btn-sm">
                  {t("navNotifCall") || "Call"}
                </a>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setHospitalDetailsModal(null)}
              >
                {t("navNotifClose") || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
          {navLink("/urgent-requests", t("navUrgentRequests"))}
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
          {navLink("/urgent-requests", t("navUrgentRequests"))}
          {navLink("/settings", t("navSettings"))}
          {notificationBell}
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
          {navLink("/urgent-requests", t("navUrgentRequests"))}
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
          {notificationBell}
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
