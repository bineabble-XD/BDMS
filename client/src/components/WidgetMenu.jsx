// client/src/components/WidgetMenu.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiGrid } from "react-icons/fi";

import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { useLanguage } from "../context/LanguageContext";
import { useFloatingPanel } from "../context/FloatingPanelContext";

const WidgetMenu = () => {
  const { t } = useLanguage();
  const { openPanel, setOpenPanel } = useFloatingPanel();
  const open = openPanel === "widget";
  const [visible, setVisible] = useState(() => {
    const stored = localStorage.getItem(SETTINGS_KEYS.WIDGET_VISIBLE);
    return stored === null || stored === "true";
  });

  // Color blindness toggle (you already had this feature)
  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true"
  );

  const panelRef = useRef(null);
  const fabRef = useRef(null);

  // Close panel when clicking outside (but not when clicking the widget button itself)
  useEffect(() => {
    const onDown = (e) => {
      if (!open) return;
      const inPanel = panelRef.current?.contains(e.target);
      const onFab = fabRef.current?.contains(e.target);
      const onChatbot = e.target.closest?.(".chatbot-fab");
      if (!inPanel && !onFab && !onChatbot) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggleVisible = (value) => {
    setVisible(value);
    localStorage.setItem(SETTINGS_KEYS.WIDGET_VISIBLE, value ? "true" : "false");
    if (!value) setOpenPanel(null);
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
            ref={fabRef}
            type="button"
            className="widget-fab"
            onClick={() => setOpenPanel(open ? null : "widget")}
            aria-expanded={open}
            title={t?.("widgetsBtn") || "Widgets"}
          >
            <FiGrid size={18} />
          </button>

          {/* Panel */}
          {open && (
        <div className="widget-panel" ref={panelRef}>
          <div className="widget-panel-header">
            <div className="widget-panel-title">{t?.("widgetsTitle") || "Quick Widgets"}</div>
            <button
              type="button"
              className="widget-close"
              onClick={() => setOpenPanel(null)}
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
            <Link to="/settings" className="widget-link" onClick={() => setOpenPanel(null)}>
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