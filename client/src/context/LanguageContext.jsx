import React, { createContext, useContext, useState, useEffect } from "react";
import { SETTINGS_KEYS, applySettings } from "../utils/settingsUtils";
import { translations } from "../locales/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(SETTINGS_KEYS.LANGUAGE) || "EN";
  });

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEYS.LANGUAGE) || "EN";
    if (stored !== language) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang) => {
    localStorage.setItem(SETTINGS_KEYS.LANGUAGE, lang);
    setLanguageState(lang);
    applySettings();
  };

  const t = (key) => {
    return translations[language]?.[key] ?? translations.EN[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
