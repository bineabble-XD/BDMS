import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import donorIllustration from "../assets/9+.png";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const ResetPassword = () => {
  const { t, language } = useLanguage();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const validatePassword = (value) => {
    setPasswordValidations({
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
      length: value.length >= 8,
    });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setStatus(t("rpPwMismatch"));
      return;
    }

    const rulesPassed = Object.values(passwordValidations).every((x) => x);
    if (!rulesPassed) {
      setStatus(t("rpPwCriteria"));
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.message || t("rpInvalidLink"));
      } else {
        setStatus(data.message || t("rpSuccessRedirect"));
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setStatus(t("rpNetwork"));
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
          

          <h3 className="fw-semibold mb-2 text-danger">{t("rpTitle")}</h3>

          <p className="small text-muted mb-4">{t("rpSubtitle")}</p>

          <div
            style={{
              maxWidth: "420px",
              margin: "0 auto",
              border: "1px solid #ddd",
              padding: "25px 20px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3 position-relative">
                <label className="form-label">{t("rpNewPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  onFocus={() => setShowPasswordHints(true)}
                  onBlur={() => setShowPasswordHints(false)}
                />

                {showPasswordHints && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "6px",
                      padding: "8px 10px",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      fontSize: "12px",
                      zIndex: 10,
                      minWidth: "250px",
                    }}
                  >
                    <strong style={{ fontSize: "11px" }}>{t("regPasswordMustContain")}</strong>
                    <ul
                      style={{
                        listStyle: "none",
                        paddingLeft: 0,
                        marginTop: "6px",
                        marginBottom: 0,
                      }}
                    >
                      <li
                        style={{
                          color: passwordValidations.lower ? "green" : "red",
                        }}
                      >
                        {passwordValidations.lower ? "✔" : "✘"} {t("regPwLower")}
                      </li>
                      <li
                        style={{
                          color: passwordValidations.upper ? "green" : "red",
                        }}
                      >
                        {passwordValidations.upper ? "✔" : "✘"} {t("regPwUpper")}
                      </li>
                      <li
                        style={{
                          color: passwordValidations.number ? "green" : "red",
                        }}
                      >
                        {passwordValidations.number ? "✔" : "✘"} {t("regPwNumber")}
                      </li>
                      <li
                        style={{
                          color: passwordValidations.special ? "green" : "red",
                        }}
                      >
                        {passwordValidations.special ? "✔" : "✘"} {t("regPwSpecial")}
                      </li>
                      <li
                        style={{
                          color: passwordValidations.length ? "green" : "red",
                        }}
                      >
                        {passwordValidations.length ? "✔" : "✘"} {t("regPwLength")}
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">{t("rpConfirmPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 mb-3"
                disabled={loading}
              >
                {loading ? t("rpSaving") : t("rpResetBtn")}
              </button>
            </form>

            {status && <p className="small text-muted mb-2">{status}</p>}

            <p className="small mt-3">
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

export default ResetPassword;
