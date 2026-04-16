import React from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * EN / Arabic language switch for auth pages (persists via LanguageContext).
 */
export default function AuthLanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="auth-language-toggle d-flex align-items-center gap-2 flex-wrap"
      lang={language === "AR" ? "ar" : "en"}
    >
      <span className="small text-muted mb-0">{t("settingsLanguage")}</span>
      <div className="toggle-group" role="group" aria-label={t("settingsLanguage")}>
        <span
          role="button"
          tabIndex={0}
          className={`toggle-btn ${language === "EN" ? "active" : ""}`}
          onClick={() => setLanguage("EN")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setLanguage("EN");
            }
          }}
        >
          EN
        </span>
        <span
          role="button"
          tabIndex={0}
          className={`toggle-btn ${language === "AR" ? "active" : ""}`}
          onClick={() => setLanguage("AR")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setLanguage("AR");
            }
          }}
        >
          ع
        </span>
      </div>
    </div>
  );
}
