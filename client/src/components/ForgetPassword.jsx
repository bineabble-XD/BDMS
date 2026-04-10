import React, { useState } from "react";
import { Link } from "react-router-dom";
import donorIllustration from "../assets/9+.png";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const ForgetPassword = () => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.message || "Something went wrong. Please try again.");
      } else {
        setStatus(
          data.message ||
          "If an account with that email exists, a reset link has been sent."
        );
      }
    } catch (err) {
      setStatus("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page container-fluid"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="row min-vh-100 align-items-start">
        <div
          className="col-md-7 auth-left"
          style={{
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >

          <h3 className="fw-semibold mb-2 text-danger">{t("fpTitle")}</h3>

          <p className="small text-muted mb-4">{t("fpSubtitle")}</p>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">{t("fpEmail")}</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? t("fpSending") : t("fpSendLink")}
              </button>
            </form>

            {status && (
              <p className="small text-muted mb-2">
                {status}
              </p>
            )}

            <p className="small mt-3">
              {t("fpRemember")}{" "}
              <Link to="/login" className="text-danger text-decoration-none">
                {t("fpBackLogin")}
              </Link>
            </p>
          </div>
        </div>

        <div className="col-md-5 text-center d-none d-md-block">
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

export default ForgetPassword;
