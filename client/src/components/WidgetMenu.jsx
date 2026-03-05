// client/src/components/WidgetMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

// ✅ Oman helpers (no extra file needed)
const getTodayInOman = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" }); // YYYY-MM-DD
};

const isTodayInOman = (dateStr) => {
  if (!dateStr) return false;
  const today = getTodayInOman();
  const d = new Date(dateStr).toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" });
  return d === today;
};

const formatTimeOman = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    timeZone: "Asia/Muscat",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const WidgetMenu = () => {
  const { t } = useLanguage();

  // If your app has Redux auth slice, this will work.
  // If not, it still works via localStorage fallback.
  const auth = useSelector((state) => state?.auth);
  const reduxUser = auth?.user;

  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("bdmsUser") || "null");
    } catch {
      return null;
    }
  })();

  const activeUser = reduxUser || localUser;

  const [open, setOpen] = useState(false);

  // Color blindness toggle (you already had this feature)
  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true"
  );

  // Reminders (AUTO — no ON/OFF)
  const [reminders, setReminders] = useState([]);
  const [remLoading, setRemLoading] = useState(false);

  const panelRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggleColorBlind = (value) => {
    setColorBlind(value);
    localStorage.setItem(SETTINGS_KEYS.COLOR_BLIND, value ? "true" : "false");
    applySettings(); // uses your existing logic to apply classes/styles
  };

  // Fetch reminders ONLY when the widget menu is opened
  useEffect(() => {
    const fetchReminders = async () => {
      if (!open) return;
      if (!activeUser?._id) return;
      if ((activeUser?.role || "").toLowerCase() !== "donor") return;

      try {
        setRemLoading(true);

        const res = await fetch(`${API_BASE}/bookings/donor/${activeUser._id}`);
        const data = await res.json();

        const all = data?.bookings || [];

        const todays = all
          .filter((b) => isTodayInOman(b.appointmentDate))
          .filter((b) => !["cancelled", "rejected", "completed"].includes((b.status || "").toLowerCase()))
          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

        setReminders(todays);
      } catch {
        setReminders([]);
      } finally {
        setRemLoading(false);
      }
    };

    fetchReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeUser?._id]);

  return (
    <div className="widget-menu-wrap" aria-label="Widget menu">
      {/* Floating button */}
      <button
        type="button"
        className="widget-fab"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        {t?.("widgetsBtn") || "Widgets"}
      </button>

      {/* Panel */}
      {open && (
        <div className="widget-panel" ref={panelRef}>
          <div className="widget-panel-header">
            <div className="widget-panel-title">{t?.("widgetsTitle") || "Quick Widgets"}</div>
            <button
              type="button"
              className="widget-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Color Blindness */}
          <div className="widget-row">
            <div className="widget-label">{t?.("widgetsColorBlind") || "Color Blindness"}</div>
            <div className="widget-toggle">
              <button
                type="button"
                className={`widget-toggle-btn ${!colorBlind ? "active" : ""}`}
                onClick={() => toggleColorBlind(false)}
              >
                {t?.("settingsOff") || "Off"}
              </button>
              <button
                type="button"
                className={`widget-toggle-btn ${colorBlind ? "active" : ""}`}
                onClick={() => toggleColorBlind(true)}
              >
                {t?.("settingsOn") || "On"}
              </button>
            </div>
          </div>

          {/* Reminders (AUTO — no ON/OFF) */}
          <div
            className="widget-row"
            style={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="widget-label">{t?.("widgetsReminders") || "Reminders"}</div>
              <Link
                to="/my-appointments"
                className="widget-link"
                onClick={() => setOpen(false)}
              >
                {t?.("widgetsViewLink") || "View"}
              </Link>
            </div>

            {((activeUser?.role || "").toLowerCase() !== "donor") ? (
              <div className="text-muted" style={{ fontSize: 13 }}>
                {t?.("widgetsDonorOnly") || "Reminders are available for donors only."}
              </div>
            ) : remLoading ? (
              <div style={{ fontSize: 13 }}>
                {t?.("widgetsLoading") || "Loading reminders..."}
              </div>
            ) : reminders.length === 0 ? (
              <div className="text-muted" style={{ fontSize: 13 }}>
                {t?.("widgetsNoToday") || "No appointments today."}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {reminders.slice(0, 3).map((b) => (
                  <div
                    key={b._id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>
                      {b?.hospital?.hospitalName || b?.hospitalName || "Hospital"}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {(t?.("Today At") || "Today at")}{" "}
                      <b>{formatTimeOman(b.appointmentDate)}</b>{" "}
                      • {(t?.("Blood") || "Blood")}: <b>{b.bloodType}</b>
                    </div>
                    <div style={{ fontSize: 12 }} className="text-muted">
                      {(t?.("Status") || "Status")}: {b.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="widget-links">
            <Link to="/settings" className="widget-link" onClick={() => setOpen(false)}>
              {t?.("widgetsSettingsLink") || "Settings"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetMenu;