import React from "react";
import { Link } from "react-router-dom";
import donorIllustration from "../assets/9+.png";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const EmailVerified = () => {
  const { t, language } = useLanguage();

  return (
    <div
      className="auth-page container-fluid"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="row align-items-center min-vh-100">
        <div className="col-md-6 auth-left">
          <div className="d-flex align-items-center gap-2 mb-4">
            <img
              src={bdmslogo}
              alt="BDMS Logo"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">{t("brandBlood")}</span>{" "}
                <span>{t("brandDonation")}</span>
              </h5>
              <small className="text-muted">{t("profNavBrandSub")}</small>
            </div>
          </div>

          <h2 className="auth-title mb-3">{t("evTitle")}</h2>

          <p className="text-muted mb-4">{t("evBody")}</p>

          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center px-3 py-2 rounded-3"
              style={{
                backgroundColor: "#f1f5f9",
              }}
            >
              <span
                className="me-2"
                style={{ fontSize: "1.5rem", lineHeight: 1 }}
              >
                ✅
              </span>
              <span className="fw-semibold">{t("evCompleted")}</span>
            </div>
          </div>

          <Link to="/login" className="btn btn-danger w-100 mb-3">
            {t("evGoLogin")}
          </Link>

          <p className="small text-muted">{t("evFooter")}</p>
        </div>

        <div className="col-md-6 auth-right text-center">
          <img
            src={donorIllustration}
            alt={t("altBloodDonor")}
            className="auth-illustration img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
