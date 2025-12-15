import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerHospital, resetHospitalState } from "../features/hospitalSlice";
import donorIllustration from "../assets/1+.png"; 
const HospitalRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.hospital);

  const [form, setForm] = useState({
    hospitalName: "",
    city: "",
    type: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    email: "", 
    password: "", 
  });

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
    const phone = form.contactPhone.trim();

    if (!emailRegex.test(contactEmail)) {
      alert("Please enter a valid contact email.");
      return;
    }

    if (!emailRegex.test(loginEmail)) {
      alert("Please enter a valid login email.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    const rulesPassed = Object.values(passwordValidations).every((x) => x);
    if (!rulesPassed) {
      alert("Password does not meet the required criteria.");
      return;
    }

    if (!/^[0-9]+$/.test(phone)) {
      alert("Contact phone must contain digits only.");
      return;
    }

    dispatch(
      registerHospital({
        ...form,
        contactEmail,
        email: loginEmail,
      })
    )
      .unwrap()
      .then((data) => {
        alert(
          data?.message ||
          "Hospital registration submitted and pending admin approval."
        );
        navigate("/login");
      })
      .catch(() => {
        if (error) {
          alert(error);
        }
      });
  };

  return (
    <div className="register-page container-fluid">
      <div className="row min-vh-100 align-items-center">
        <div
          className="col-md-7 auth-left"
          style={{
            paddingRight: "10px",
          }}
        >


          <h3 className="mb-3 fw-semibold" style={{ color: "#d10000" }}>
            Hospital Registration
          </h3>

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
                <label className="form-label">Hospital Name</label>
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
                  <label className="form-label">City</label>
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
                  <label className="form-label">Hospital Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">Select type</option>
                    <option>Government</option>
                    <option>Private</option>
                    <option>Military</option>
                    <option>Blood Inventory</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Name only (letters, max 20 characters).
                </small>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact Email</label>
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
                <label className="form-label">Login Email</label>
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
                <label className="form-label">Login Password</label>
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
                    <strong style={{ fontSize: "11px" }}>
                      PASSWORD MUST CONTAIN:
                    </strong>
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
                        {passwordValidations.lower ? "✔" : "✘"} At least one
                        lowercase letter
                      </li>
                      <li
                        style={{
                          color: passwordValidations.upper ? "green" : "red",
                        }}
                      >
                        {passwordValidations.upper ? "✔" : "✘"} At least one
                        uppercase letter
                      </li>
                      <li
                        style={{
                          color: passwordValidations.number ? "green" : "red",
                        }}
                      >
                        {passwordValidations.number ? "✔" : "✘"} At least one
                        number
                      </li>
                      <li
                        style={{
                          color: passwordValidations.special ? "green" : "red",
                        }}
                      >
                        {passwordValidations.special ? "✔" : "✘"} At least one
                        special character
                      </li>
                      <li
                        style={{
                          color: passwordValidations.length ? "green" : "red",
                        }}
                      >
                        {passwordValidations.length ? "✔" : "✘"} Minimum 8
                        characters
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
                {loading ? "Submitting..." : "Register Hospital"}
              </button>
            </form>
          </div>

          <p className="mt-3">
            Already registered?{" "}
            <Link to="/login" className="text-decoration-underline">
              Login
            </Link>
          </p>
        </div>

        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt="Hospital"
            className="auth-illustration img-fluid"
            style={{ maxWidth: "70%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;
