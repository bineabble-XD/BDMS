export const SETTINGS_KEYS = {
  DARK_MODE: "bdms_dark_mode",
  LANGUAGE: "bdms_language",
  FONT_SIZE: "bdms_font_size",
  COLOR_BLIND: "bdms_colorblind",
  WIDGET_VISIBLE: "bdms_widget_visible",
};

export function applySettings() {
  const darkMode = localStorage.getItem(SETTINGS_KEYS.DARK_MODE) === "true";
  const language = localStorage.getItem(SETTINGS_KEYS.LANGUAGE) || "EN";
  const fontSize = localStorage.getItem(SETTINGS_KEYS.FONT_SIZE) || "Medium";
  const colorBlind = localStorage.getItem(SETTINGS_KEYS.COLOR_BLIND) === "true";

  // Dark mode
  if (darkMode) {
    document.body.classList.add("bdms-dark");
  } else {
    document.body.classList.remove("bdms-dark");
  }

  // Language / RTL
  const html = document.documentElement;
  if (language === "AR") {
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
  } else {
    html.setAttribute("dir", "ltr");
    html.setAttribute("lang", "en");
  }

  // Font size
  html.classList.remove("bdms-font-small", "bdms-font-medium", "bdms-font-large");
  const fontClass =
    fontSize === "Small"
      ? "bdms-font-small"
      : fontSize === "Large"
        ? "bdms-font-large"
        : "bdms-font-medium";
  html.classList.add(fontClass);

  // Color blindness mode
  if (colorBlind) {
    document.body.classList.add("bdms-colorblind");
  } else {
    document.body.classList.remove("bdms-colorblind");
  }

  window.dispatchEvent(new CustomEvent("bdms-settings-changed"));
}
