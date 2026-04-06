import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import heroImg from "../assets/2+.png";
import SocialFeed from "./SocialFeed.jsx";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ChatbotWidget from "./ChatbotWidget.jsx";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const user = useSelector((state) => state.auth.user);

  const displayName =
    user?.fName || user?.uname || user?.name || user?.email || t("user");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");         
  };

  return (
    <div className="home-page">
     
      <section id="hero" className="hero-section">
        <div className="container h-100">
          <div className="row align-items-center h-100">
            <div className="col-md-6 mb-4 mb-md-0">
              <p className="hero-tagline mb-2">{t("heroTagline")}</p>
              <h1 className="hero-title mb-3">
                <span>{t("heroTitle1")}</span> <br />
                <span>{t("heroTitle2")}</span>
              </h1>
              <p className="hero-text mb-4">
                {t("heroText")}
              </p>
            </div>

            <div className="col-md-6 text-center">
              <img
                src={heroImg}
                alt="Blood donation illustration"
                className="img-fluid hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section py-5">
        <div className="container">
          <h3 className="mb-3 fw-semibold">{t("aboutTitle")}</h3>
          <p className="lead mb-3">
            {t("aboutGoal")}
          </p>
          <p className="text-muted mb-0">
            {t("aboutPlatform")}
          </p>
        </div>
      </section>

      <section id="urgent" className="urgent-section py-5 bg-light">
        <div className="container">
          <SocialFeed />

        </div>
      </section>
       <section className="social-section py-4 text-center">
              <div className="container">
                <h4 className="mb-3">{t("followBdms")}</h4>
      
                <div
                  style={{ display: "flex", justifyContent: "center", gap: "25px" }}
                >
                  <a
                    href="https://www.instagram.com/bdmstech?igsh=MWI1b3U1cjdqeGp1dw%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={35} color="#E1306C" />
                  </a>
      
                  <a
                    href="https://x.com/bdmsoman?s=21"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter size={35} />
                  </a>
                </div>
              </div>
            </section>
            <ChatbotWidget />
    </div>
  );
};

export default Home;
