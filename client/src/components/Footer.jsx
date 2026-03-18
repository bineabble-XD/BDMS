import React from "react";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="bdms-footer">
      <p>© {new Date().getFullYear()} {t("footerRights")}</p>
    </footer>
  );
};

export default Footer;
