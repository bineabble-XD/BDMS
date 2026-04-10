import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/9+.png";
import bdmslogo from "../assets/bdmslogo.png";
import {
  localLiveError,
  maxLocalDigitsForCountry,
  phoneLocalErrorForCountry,
} from "../utils/phoneValidation";
import { useLanguage } from "../context/LanguageContext";

const Register = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fName: "",
    phoneNum: "",
    Age: "",
    gender: "",
    bloodType: "",
    email: "",
    password: "",
    address: "",
  });

  const [countryCode, setCountryCode] = useState("+968"); 

  const [phoneError, setPhoneError] = useState(""); // For phone validation error message

  const [passwordValidations, setPasswordValidations] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const validatePassword = (password) => {
    setPasswordValidations({
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      length: password.length >= 8,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: length and first-digit rules depend on country (see phoneValidation.js)
    if (name === "phoneNum") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const maxLen = maxLocalDigitsForCountry(countryCode);
      if (numericValue.length > maxLen) return;
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setPhoneError(localLiveError(countryCode, numericValue));
      return;
    }

    // Password validation
    if (name === "password") {
      validatePassword(value);
    }

    // For all other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const requiredFields = ["fName", "phoneNum", "Age", "gender", "bloodType", "email", "password", "address"];
    let formIsValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formIsValid = false;
      }
    });
    if (!formIsValid) {
      alert(t("regFillAllFields"));
      return;
    }

    const phoneErr = phoneLocalErrorForCountry(countryCode, formData.phoneNum);
    if (phoneErr) {
      formIsValid = false;
      setPhoneError(phoneErr);
    }

    if (!formIsValid) return;

    // If the form is valid, submit data
    const numericCode = countryCode.replace("+", "");
    const payload = {
      ...formData,
      phoneNum: numericCode + formData.phoneNum,
      role: "Donor",
    };

    dispatch(registerUser(payload));
  };

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(clearAuthMessage());
      navigate("/login");
    }
  }, [message, dispatch, navigate]);

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
            maxHeight: "100vh",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          <h3 className="mb-3 fw-semibold text-danger">{t("regTitle")}</h3>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <form className="register-form" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label">{t("regFullName")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  required
                  maxLength={20}
                />
                <small className="text-muted">{t("regMax20")}</small>
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label">{t("regPhone")}</label>
                <div className="row g-2">
                  <div className="col-3">
                    <select
                      className="form-select"
                      value={countryCode}
                      onChange={(e) => {
                        const next = e.target.value;
                        const trimmed = formData.phoneNum.slice(
                          0,
                          maxLocalDigitsForCountry(next)
                        );
                        setCountryCode(next);
                        setFormData((prev) => ({ ...prev, phoneNum: trimmed }));
                        setPhoneError(localLiveError(next, trimmed));
                      }}
                    >
                      <option value="+968">+968</option>
                      <option value="+971">+971</option>
                      <option value="+966">+966</option>
                      <option value="+974">+974</option>
                      <option value="+973">+973</option>
                      <option value="+965">+965</option>
                    </select>
                  </div>
                  <div className="col-9">
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNum"
                      value={formData.phoneNum}
                      onChange={handleChange}
                      required
                      placeholder=""
                    />
                    {phoneError && <small className="text-danger">{phoneError}</small>}
                  </div>
                </div>
              </div>

              {/* Other Form Fields (Age, Gender, etc.) */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("regAge")}</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    min="18"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("regGender")}</label>
                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t("regSelectGender")}</option>
                    <option value="Male">{t("regMale")}</option>
                    <option value="Female">{t("regFemale")}</option>
                    <option value="Other">{t("regOther")}</option>
                  </select>
                </div>
              </div>

              {/* Blood Type */}
              <div className="mb-3">
                <label className="form-label">{t("regBloodType")}</label>
                <select
                  className="form-select"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t("regSelectBloodType")}</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">{t("regEmail")}</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-3 position-relative">
                <label className="form-label">{t("regPassword")}</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
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

              {/* Address Field */}
              <div className="mb-3">
                <label className="form-label">{t("regAddress")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  {t("regTerms")}
                </label>
              </div>

              <p className="small text-muted mb-3">
                <a href="#tc" className="text-decoration-underline">
                  {t("regReadTC")}
                </a>
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? t("regRegistering") : t("regRegister")}
              </button>
            </form>
          </div>

          <p className="mt-3">
            {t("regAlreadyHave")}{" "}
            <Link to="/login" className="text-decoration-underline">
              {t("regLoginLink")}
            </Link>
          </p>

          <p className="mt-3">
            {t("regHospitalPrompt")}{" "}
            <Link
              to="/register-hospital"
              className="text-decoration-underline"
            >
              {t("regHospitalLink")}
            </Link>
          </p>
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

export default Register;
