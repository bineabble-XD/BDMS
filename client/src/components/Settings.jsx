// src/components/Settings.jsx

import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  // initialize from localStorage so dark mode persists
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("bdms_dark_mode") === "true";
  });

  const [language, setLanguage] = useState("EN");
  const [fontSize, setFontSize] = useState("Medium");
  const [colorBlind, setColorBlind] = useState(false);

  // 🔥 hook dark mode to the whole app (body class + persistence)
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bdms-dark");
    } else {
      document.body.classList.remove("bdms-dark");
    }
    localStorage.setItem("bdms_dark_mode", darkMode ? "true" : "false");
  }, [darkMode]);

  // Back button logic
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/home");
  };

  return (
    <div className={`settings-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="container py-4">
        {/* Top row: back arrow + title */}
        <div className="d-flex align-items-center mb-4">
          <button className="settings-back-btn me-3" onClick={goBack}>
            <FiArrowLeft size={22} />
          </button>

          <div className="d-flex align-items-center">
            <FaCog size={22} className="me-2" />
            <h5 className="fw-bold mb-0">Settings</h5>
          </div>
        </div>

        {/* Main white card */}
        <div className="settings-box p-4">
          {/* DARK MODE */}
          <div className="setting-row">
            <span className="setting-label">Dark Mode :</span>

            <div className="d-flex align-items-center gap-3">
              <div className="toggle-group">
                <span
                  className={`toggle-btn ${!darkMode ? "active" : ""}`}
                  onClick={() => setDarkMode(false)}
                >
                  OFF
                </span>
                <span
                  className={`toggle-btn ${darkMode ? "active" : ""}`}
                  onClick={() => setDarkMode(true)}
                >
                  ON
                </span>
              </div>

              <FaCog className="setting-icon" />
            </div>
          </div>

          {/* LANGUAGE */}
          <div className="setting-row">
            <span className="setting-label">Language :</span>

            <div className="d-flex align-items-center gap-3">
              <span className="setting-value">
                {language === "EN" ? "English" : "Arabic"}
              </span>

              <div className="lang-toggle">
                <button
                  className={`lang-btn ${language === "EN" ? "active" : ""}`}
                  onClick={() => setLanguage("EN")}
                >
                  EN
                </button>
                <button
                  className={`lang-btn ${language === "AR" ? "active" : ""}`}
                  onClick={() => setLanguage("AR")}
                >
                  ع
                </button>
              </div>
            </div>
          </div>

          {/* FONT SIZE */}
          <div className="setting-row">
            <span className="setting-label">Font Size :</span>

            <div className="d-flex align-items-center gap-3">
              <span className="setting-value">{fontSize}</span>

              <button
                className="font-btn"
                onClick={() =>
                  setFontSize(fontSize === "Medium" ? "Large" : "Medium")
                }
              >
                Tt
              </button>
            </div>
          </div>

          {/* COLOR BLINDNESS */}
          <div className="setting-row">
            <span className="setting-label">Color Blindness :</span>

            <div className="toggle-group">
              <span
                className={`toggle-btn ${!colorBlind ? "active" : ""}`}
                onClick={() => setColorBlind(false)}
              >
                OFF
              </span>
              <span
                className={`toggle-btn ${colorBlind ? "active" : ""}`}
                onClick={() => setColorBlind(true)}
              >
                ON
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
