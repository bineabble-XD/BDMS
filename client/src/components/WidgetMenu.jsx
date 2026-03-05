// client/src/components/WidgetMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { useLanguage } from "../context/LanguageContext";

const WidgetMenu = () => {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(() => {
    const stored = localStorage.getItem(SETTINGS_KEYS.WIDGET_VISIBLE);
    return stored === null || stored === "true";
  });

  // Color blindness toggle (you already had this feature)
  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true"
  );

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

  const toggleVisible = (value) => {
    setVisible(value);
    localStorage.setItem(SETTINGS_KEYS.WIDGET_VISIBLE, value ? "true" : "false");
    if (!value) setOpen(false);
  };

  const toggleColorBlind = (value) => {
    setColorBlind(value);
    localStorage.setItem(SETTINGS_KEYS.COLOR_BLIND, value ? "true" : "false");
    applySettings(); // uses your existing logic to apply classes/styles
  };

  return (
    <div className="widget-menu-wrap" aria-label="Widget menu">
      {/* Show-widget tab (when hidden) */}
      {!visible && (
        <button
          type="button"
          className="widget-show-tab"
          onClick={() => toggleVisible(true)}
          aria-label="Show widgets"
        >
          ◀
        </button>
      )}

      {/* Floating button + panel (when visible) */}
      {visible && (
        <>
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

          {/* Show/Hide widget button */}
          <div className="widget-row">
            <div className="widget-label">{t?.("widgetsShowButton") || "Show widget button"}</div>
            <div className="widget-toggle">
              <button
                type="button"
                className={`widget-toggle-btn ${visible ? "active" : ""}`}
                onClick={() => toggleVisible(true)}
              >
                {t?.("settingsOn") || "On"}
              </button>
              <button
                type="button"
                className={`widget-toggle-btn ${!visible ? "active" : ""}`}
                onClick={() => toggleVisible(false)}
              >
                {t?.("settingsOff") || "Off"}
              </button>
            </div>
          </div>

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

          <div className="widget-links">
            <Link to="/settings" className="widget-link" onClick={() => setOpen(false)}>
              {t?.("widgetsSettingsLink") || "Settings"}
            </Link>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
};

export default WidgetMenu;