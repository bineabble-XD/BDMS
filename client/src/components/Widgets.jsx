import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { useLanguage } from "../context/LanguageContext";

const Widgets = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [colorBlind, setColorBlind] = useState(
    localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true"
  );

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEYS.COLOR_BLIND, colorBlind ? "true" : "false");
    applySettings();
  }, [colorBlind]);

  return (
    <div className="widgets-page">
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button className="settings-back-btn me-3" onClick={() => navigate(-1)}>
            <FiArrowLeft size={22} />
          </button>
          <h5 className="fw-bold mb-0">{t("widgetsPageTitle")}</h5>
        </div>

        <div className="settings-box p-4">
          <div className="setting-row">
            <span className="setting-label">{t("widgetsColorBlind")}</span>
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

          {/* Optional “More” placeholder */}
          <div className="mt-4 text-muted">
            {t("widgetsMoreHint")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;