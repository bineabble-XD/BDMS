import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="about-page">
      <section className="about-hero text-center text-white">
        <div className="container py-5">
          <h1 className="fw-bold mb-3">{t("aboutUsTitle")}</h1>
          <p className="lead mb-4">
            {t("aboutUsLead")}
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <div className="badge bg-light text-danger px-3 py-2">
              🎯 {t("badgeSaveLives")}
            </div>
            <div className="badge bg-light text-danger px-3 py-2">
              🤝 {t("badgeDonorsHospitals")}
            </div>
            <div className="badge bg-light text-danger px-3 py-2">
              📍 {t("badgeFocusedOman")}
            </div>
          </div>
        </div>
      </section>

      <section className="about-content py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">{t("ourMission")}</h5>
                <p className="mb-0 text-muted">
                  {t("missionText")}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">{t("ourVision")}</h5>
                <p className="mb-0 text-muted">
                  {t("visionText")}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-2">{t("howBdmsHelps")}</h5>
                <ul className="mb-0 text-muted small ps-3">
                  <li>{t("helpItem1")}</li>
                  <li>{t("helpItem2")}</li>
                  <li>{t("helpItem3")}</li>
                  <li>{t("helpItem4")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <div className="about-card h-100">
                <h5 className="fw-semibold mb-3">{t("contactInfo")}</h5>
                <p className="mb-2">
                  <span className="fw-semibold me-1">📞 {t("contactPhone")}:</span>
                  +968 9982 9982
                </p>
                <p className="mb-2">
                  <span className="fw-semibold me-1">✉ {t("contactEmail")}:</span>
                  BDMS@gmail.com
                </p>
                <p className="mb-0">
                  <span className="fw-semibold me-1">📍 {t("contactLocation")}:</span>
                  Muscat, Oman
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="about-card text-center h-100">
                <img
                  src={bdmslogo}
                  alt="BDMS logo"
                  className="mb-3"
                  style={{ width: 90, height: 90, objectFit: "contain" }}
                />
                <h6 className="fw-semibold mb-2">{t("wantToGetInvolved")}</h6>
                <p className="text-muted small mb-3">
                  {t("getInvolvedText")}
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;
