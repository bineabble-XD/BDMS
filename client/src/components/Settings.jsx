import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { useLanguage } from "../context/LanguageContext";

const Settings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem(SETTINGS_KEYS.DARK_MODE) === "true";
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem(SETTINGS_KEYS.FONT_SIZE) || "Medium";
  });

  const [colorBlind, setColorBlind] = useState(() => {
    return localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true";
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEYS.DARK_MODE, darkMode ? "true" : "false");
    applySettings();
  }, [darkMode]);


  useEffect(() => {
    localStorage.setItem(SETTINGS_KEYS.FONT_SIZE, fontSize);
    applySettings();
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEYS.COLOR_BLIND, colorBlind ? "true" : "false");
    applySettings();
  }, [colorBlind]);

  const cycleFontSize = () => {
    setFontSize((prev) =>
      prev === "Small" ? "Medium" : prev === "Medium" ? "Large" : "Small"
    );
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/home");
  };

  return (
    <div className={`settings-page ${darkMode ? "dark-mode" : ""}`}>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button className="settings-back-btn me-3" onClick={goBack}>
            <FiArrowLeft size={22} />
          </button>

          <div className="d-flex align-items-center">
            <FaCog size={22} className="me-2" />
            <h5 className="fw-bold mb-0">{t("settingsTitle")}</h5>
          </div>
        </div>

        <div className="settings-box p-4">
          <div className="setting-row">
            <span className="setting-label">{t("settingsDarkMode")} :</span>

            <div className="d-flex align-items-center gap-3">
              <div className="toggle-group">
                <span
                  className={`toggle-btn ${!darkMode ? "active" : ""}`}
                  onClick={() => setDarkMode(false)}
                >
                  {t("settingsOff")}
                </span>
                <span
                  className={`toggle-btn ${darkMode ? "active" : ""}`}
                  onClick={() => setDarkMode(true)}
                >
                  {t("settingsOn")}
                </span>
              </div>

              <FaCog className="setting-icon" />
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t("settingsLanguage")} :</span>

            <div className="d-flex align-items-center gap-3">
              <span className="setting-value">
                {language === "EN" ? t("settingsEnglish") : t("settingsArabic")}
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

          <div className="setting-row">
            <span className="setting-label">{t("settingsFontSize")} :</span>

            <div className="d-flex align-items-center gap-3">
              <span className="setting-value">{fontSize}</span>

              <button className="font-btn" onClick={cycleFontSize} title="Cycle: Small → Medium → Large">
                Tt
              </button>
            </div>
          </div>

          <div className="setting-row">
            <span className="setting-label">{t("settingsColorBlind")} :</span>

            <div className="toggle-group">
              <span
                className={`toggle-btn ${!colorBlind ? "active" : ""}`}
                onClick={() => setColorBlind(false)}
              >
                {t("settingsOff")}
              </span>
              <span
                className={`toggle-btn ${colorBlind ? "active" : ""}`}
                onClick={() => setColorBlind(true)}
              >
                {t("settingsOn")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
