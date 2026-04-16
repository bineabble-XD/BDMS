import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthMessage } from "../features/authSlice";
import donorIllustration from "../assets/1+.png";
import { useLanguage } from "../context/LanguageContext";
import AuthLanguageToggle from "./AuthLanguageToggle";

const INVENTORY_EMAIL = "inventory@bdms.com";
const INVENTORY_PASSWORD = "Blood@123";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  const auth = useSelector((state) => state.auth || {});
  const { loading, error, user } = auth;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "email" || name === "password") {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const email = formData.email.trim();
    const password = formData.password;

    if (email === INVENTORY_EMAIL && password === INVENTORY_PASSWORD) {
      setFieldErrors({ email: false, password: false });
      navigate("/inventory");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const missingEmail = !email;
    const missingPassword = !password;

    setFieldErrors({
      email: missingEmail,
      password: missingPassword,
    });

    if (missingEmail) {
      alert("Please enter your email address.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (missingPassword) {
      alert("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setFieldErrors({ email: false, password: false });
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (!user) return;

    if (user.isAdmin === true) {
      navigate("/reports");
      return;
    }

    if (user.isHospital === true) {
      fetch(`${API_BASE}/hospitals/profile/${user._id}`)
        .then((res) => res.json())
        .then((profile) => {
          if (profile?.type === "Blood Inventory") {
            navigate("/inventory");
          } else {
            navigate("/hospital-dash");
          }
        });
      return;
    }

    const from = location.state?.from;
    if (from === "/appointments") {
      const { urgentHospitalId, urgentBloodType } = location.state || {};
      navigate("/appointments", {
        replace: true,
        state: urgentHospitalId ? { urgentHospitalId, urgentBloodType } : undefined,
      });
      return;
    }

    navigate("/home");
  }, [user, navigate, location.state]);



  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearAuthMessage());
    }
  }, [error, dispatch]);

  return (
    <div
      className="login-page container-fluid"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="row min-vh-100 align-items-center">

        <div className="col-md-7 d-flex justify-content-end">
          <div style={{ width: "100%", maxWidth: "480px" }}>

            <div className="d-flex justify-content-end mb-2">
              <AuthLanguageToggle />
            </div>

            <h4 className="text-center mb-4 text-danger fw-semibold">
              {t("loginTitle")}
            </h4>

            <div className="form-wrapper">

              <form onSubmit={handleSubmit} noValidate>

                <div className="mb-3">
                  <label className="form-label small text-muted">{t("loginEmailPlaceholder")}</label>
                  <input
                    type="email"
                    className={`form-control${fieldErrors.email ? " is-invalid" : ""}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("loginEmailPlaceholder")}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">{t("loginPasswordPlaceholder")}</label>
                  <input
                    type="password"
                    className={`form-control${fieldErrors.password ? " is-invalid" : ""}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("loginPasswordPlaceholder")}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-danger w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "..." : t("loginSubmit")}
                </button>
              </form>


              <p className="small mb-1">
                {t("forgetPassword")}{" "}
                <Link to="/forget-password" className="text-danger text-decoration-none">
                  {t("resetHere")}
                </Link>
              </p>

              <p className="small mb-0">
                Don’t {t("noAccount")}{" "}
                <Link to="/register" className="text-danger text-decoration-none">
                  {t("signUp")}
                </Link>
              </p>

            </div>
          </div>
        </div>

        <div className="col-md-5 d-flex justify-content-start align-items-center d-none d-md-flex">
          <img
            src={donorIllustration}
            alt="Blood donor"
            className="auth-illustration img-fluid"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
