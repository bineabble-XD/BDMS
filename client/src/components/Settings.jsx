import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const Settings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [fontSize, setFontSize] = useState("Medium");
  const [colorBlind, setColorBlind] = useState(false);

  // Back button logic
  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/home");
  };

  return (
    <div className={`settings-page ${darkMode ? "dark-mode" : ""}`}>

      {/* ======= HEADER WITH LOGO + BACK BUTTON ======= */}
      <header className="settings-header d-flex justify-content-between align-items-center px-4 py-3">

        {/* Back button (left) */}
        <button className="settings-back-btn" onClick={goBack}>
          <FiArrowLeft size={22} />
        </button>

        {/* Logo + title */}
        <div className="d-flex align-items-center gap-3">
          <img src={bdmslogo} alt="BDMS Logo" className="settings-logo" />
          <h4 className="fw-bold m-0">
            BLOOD <span className="text-danger">DONATION</span>
            <div className="small text-muted">MANAGEMENT SYSTEM</div>
          </h4>
        </div>

        {/* Spacer for alignment */}
        <div style={{ width: "32px" }}></div>
      </header>

      {/* ======= SETTINGS CONTENT ======= */}
      <div className="container mt-4">
        <div className="d-flex align-items-center mb-2">
          <FaCog size={22} className="me-2" />
          <h5 className="fw-bold">Settings</h5>
        </div>

        <div className="settings-box p-4">

          {/* ========== DARK MODE ========== */}
          <div className="setting-row">
            <label className="setting-label">Dark Mode :</label>

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

          {/* ========== LANGUAGE ========== */}
          <div className="setting-row">
            <label className="setting-label">Language :</label>

            <span className="setting-value">
              {language === "EN" ? "English" : "Arabic"}
            </span>

            <div className="lang-toggle ms-3">
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

          {/* ========== FONT SIZE ========== */}
          <div className="setting-row">
            <label className="setting-label">Font Size :</label>

            <span className="setting-value">{fontSize}</span>

            <button
              className="font-btn ms-3"
              onClick={() =>
                setFontSize(fontSize === "Medium" ? "Large" : "Medium")
              }
            >
              Tt
            </button>
          </div>

          {/* ========== COLOR BLINDNESS ========== */}
          <div className="setting-row">
            <label className="setting-label">Color Blindness :</label>

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
