import React, { useState } from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import {
  GCC_COUNTRY_CODES,
  localLiveError,
  maxLocalDigitsForCountry,
  phoneLocalErrorForCountry,
  splitStoredPhoneToForm,
} from "../utils/phoneValidation";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const HospitalProfile = () => {
  const { t, language } = useLanguage();
  const storedHospital = JSON.parse(localStorage.getItem("bdmsUser"));

  const [hospital, setHospital] = useState(storedHospital);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const phoneInit = splitStoredPhoneToForm(storedHospital?.phoneNum);
  const [countryCode, setCountryCode] = useState(phoneInit.countryCode);
  const [phoneLocal, setPhoneLocal] = useState(phoneInit.local);
  const [phoneError, setPhoneError] = useState("");

  const [formData, setFormData] = useState({
    fName: storedHospital?.fName || "",
    email: storedHospital?.email || "",
    address: storedHospital?.address || "",
  });

  if (!hospital) {
    return (
      <div className="container py-5" dir={language === "AR" ? "rtl" : "ltr"} lang={language === "AR" ? "ar" : "en"}>
        <h3>{t("hospProfNoLogin")}</h3>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneLocal") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const maxLen = maxLocalDigitsForCountry(countryCode);
      if (numericValue.length > maxLen) return;
      setPhoneLocal(numericValue);
      setPhoneError(localLiveError(countryCode, numericValue));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setMessage("");
    setError("");
    setPhoneError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    const { countryCode: c, local } = splitStoredPhoneToForm(hospital?.phoneNum);
    setCountryCode(c);
    setPhoneLocal(local);
    setPhoneError("");
    setFormData({
      fName: hospital?.fName || "",
      email: hospital?.email || "",
      address: hospital?.address || "",
    });
    setIsEditing(false);
    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const userId = hospital?._id || hospital?.id;
      if (!userId) {
        setError(t("hospProfUserIdMissing"));
        setSaving(false);
        return;
      }

      const phoneErr = phoneLocalErrorForCountry(countryCode, phoneLocal);
      if (phoneErr) {
        setPhoneError(phoneErr);
        setSaving(false);
        return;
      }

      const numericCode = countryCode.replace("+", "");
      const fullPhone = Number(`${numericCode}${phoneLocal}`);

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updates: {
            fName: formData.fName,
            email: formData.email,
            phoneNum: fullPhone,
            address: formData.address,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || t("hospProfUpdateFail"));
        setSaving(false);
        return;
      }

      const updatedUser = data.user;
      setHospital(updatedUser);
      localStorage.setItem("bdmsUser", JSON.stringify(updatedUser));
      const split = splitStoredPhoneToForm(updatedUser.phoneNum);
      setCountryCode(split.countryCode);
      setPhoneLocal(split.local);
      setPhoneError("");
      setMessage(t("hospProfUpdated"));
      setIsEditing(false);
    } catch (err) {
      setError(t("hospProfUpdateFail"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="container py-5"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <img
            src={bdmslogo}
            alt="BDMS Logo"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
          <h4 className="fw-bold mb-0">{t("hospProfTitle")}</h4>
        </div>

        <Link to="/hospital-dash" className="btn btn-outline-secondary">
          {t("hospProfBack")}
        </Link>
      </header>

      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{t("hospProfInfo")}</h3>

          {!isEditing ? (
            <button type="button" className="btn btn-danger" onClick={handleEditClick}>
              {t("edit")}
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? t("profSaving") : t("save")}
              </button>
            </div>
          )}
        </div>

        <hr />

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-warning">{error}</div>}

        <dl className="row">
          <dt className="col-sm-3">{t("hospProfName")}</dt>
          <dd className="col-sm-9">
            {isEditing ? (
              <input
                type="text"
                name="fName"
                className="form-control"
                value={formData.fName}
                onChange={handleChange}
              />
            ) : (
              hospital.fName || "City Hospital"
            )}
          </dd>

          <dt className="col-sm-3">{t("regEmail")}</dt>
          <dd className="col-sm-9">
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              hospital.email || "hospital2@gmail.com"
            )}
          </dd>

          <dt className="col-sm-3">{t("hospProfPhone")}</dt>
          <dd className="col-sm-9">
            {isEditing ? (
              <div className="row g-2">
                <div className="col-4">
                  <select
                    className="form-select"
                    value={countryCode}
                    onChange={(e) => {
                      const next = e.target.value;
                      const trimmed = phoneLocal.slice(0, maxLocalDigitsForCountry(next));
                      setCountryCode(next);
                      setPhoneLocal(trimmed);
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
                    name="phoneLocal"
                    value={phoneLocal}
                    onChange={handleChange}
                  />
                  {phoneError && <small className="text-danger">{phoneError}</small>}
                </div>
              </div>
            ) : (
              hospital.phoneNum || "91177010"
            )}
          </dd>

          <dt className="col-sm-3">{t("profRole")}</dt>
          <dd className="col-sm-9">{t("hospital")}</dd>

          <dt className="col-sm-3">{t("regBloodType")}</dt>
          <dd className="col-sm-9">{t("hospProfBloodNa")}</dd>

          <dt className="col-sm-3">{t("regAddress")}</dt>
          <dd className="col-sm-9">
            {isEditing ? (
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            ) : (
              hospital.address || "Amerat"
            )}
          </dd>

          <dt className="col-sm-3">{t("hospProfStatus")}</dt>
          <dd className="col-sm-9">
            {hospital.isAdmin ? t("hospProfAdmin") : t("hospProfStandard")}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default HospitalProfile;
