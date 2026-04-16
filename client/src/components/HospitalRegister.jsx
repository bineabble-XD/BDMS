import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerHospital, resetHospitalState } from "../features/hospitalSlice";
import donorIllustration from "../assets/1+.png";
import {
  GCC_COUNTRY_CODES,
  localLiveError,
  maxLocalDigitsForCountry,
  phoneLocalErrorForCountry,
} from "../utils/phoneValidation";
import { useLanguage } from "../context/LanguageContext";
import AuthLanguageToggle from "./AuthLanguageToggle";

const HospitalRegister = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.hospital);

  const [form, setForm] = useState({
    hospitalName: "",
    city: "",
    type: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "", // local digits only (same as donor Register phone field)
    email: "", 
    password: "", 
  });

  const [countryCode, setCountryCode] = useState("+968");
  const [phoneError, setPhoneError] = useState("");

  const [passwordValidations, setPasswordValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  const [showPasswordHints, setShowPasswordHints] = useState(false);

  useEffect(() => {
    dispatch(resetHospitalState());
  }, [dispatch]);

  const validatePassword = (value) => {
    setPasswordValidations({
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
      length: value.length >= 8,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactPerson") {
      const onlyLetters = /^[A-Za-z\s]*$/;
      if (!onlyLetters.test(value)) return; 
      if (value.length > 20) return; 
    }

    if (name === "contactPhone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const maxLen = maxLocalDigitsForCountry(countryCode);
      if (numericValue.length > maxLen) return;
      setForm((prev) => ({ ...prev, contactPhone: numericValue }));
      setPhoneError(localLiveError(countryCode, numericValue));
      return;
    }

    if (name === "password") {
      validatePassword(value);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; 


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const contactEmail = form.contactEmail.trim();
    const loginEmail = form.email.trim();
    const password = form.password;
    const phoneErr = phoneLocalErrorForCountry(countryCode, form.contactPhone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    const numericCode = countryCode.replace("+", "");
    const fullContactPhone = `${numericCode}${form.contactPhone}`;

    if (!emailRegex.test(contactEmail)) {
      alert(t("hospAlertContactEmail"));
      return;
    }

    if (!emailRegex.test(loginEmail)) {
      alert(t("hospAlertLoginEmail"));
      return;
    }

    if (!password) {
      alert(t("hospAlertPassword"));
      return;
    }

    const rulesPassed = Object.values(passwordValidations).every((x) => x);
    if (!rulesPassed) {
      alert(t("hospAlertPwRules"));
      return;
    }

    dispatch(
      registerHospital({
        ...form,
        contactPhone: fullContactPhone,
        contactEmail,
        email: loginEmail,
      })
    )
      .unwrap()
      .then((data) => {
        alert(data?.message || t("hospAlertPending"));
        navigate("/login");
      })
      .catch(() => {
        if (error) {
          alert(error);
        }
      });
  };

  return (
    <div
      className="register-page container-fluid"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="row min-vh-100 align-items-center">
        <div
          className="col-md-7 auth-left"
          style={{
            paddingRight: "10px",
          }}
        >


          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="mb-0 fw-semibold text-danger">{t("hospRegTitle")}</h3>
            <AuthLanguageToggle />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "550px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            {error && (
              <div className="alert alert-danger py-2">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">{t("hospRegName")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("hospRegCity")}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("hospRegType")}</label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">{t("hospRegSelectType")}</option>
                    <option value="Government">{t("hospTypeGov")}</option>
                    <option value="Private">{t("hospTypePrivate")}</option>
                    <option value="Military">{t("hospTypeMilitary")}</option>
                    <option value="Blood Inventory">{t("hospTypeBloodInv")}</option>
                    <option value="Other">{t("hospTypeOther")}</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">{t("hospContactPerson")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">{t("hospContactPersonHint")}</small>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("hospContactPhone")}</label>
                  <div className="row g-2">
                    <div className="col-4">
                      <select
                        className="form-select"
                        value={countryCode}
                        onChange={(e) => {
                          const next = e.target.value;
                          const trimmed = form.contactPhone.slice(
                            0,
                            maxLocalDigitsForCountry(next)
                          );
                          setCountryCode(next);
                          setForm((prev) => ({ ...prev, contactPhone: trimmed }));
                          setPhoneError(localLiveError(next, trimmed));
                        }}
                      >
                        {GCC_COUNTRY_CODES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-8">
                      <input
                        type="tel"
                        className="form-control"
                        name="contactPhone"
                        value={form.contactPhone}
                        onChange={handleChange}
                        required
                      />
                      {phoneError && (
                        <small className="text-danger d-block">{phoneError}</small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("hospContactEmail")}</label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">{t("hospLoginEmail")}</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label">{t("hospLoginPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
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

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? t("hospSubmitting") : t("hospRegisterBtn")}
              </button>
            </form>
          </div>

          <p className="mt-3">
            {t("hospAlreadyReg")}{" "}
            <Link to="/login" className="text-decoration-underline">
              {t("regLoginLink")}
            </Link>
          </p>
        </div>

        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt={t("hospital")}
            className="auth-illustration img-fluid"
            style={{ maxWidth: "70%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;
