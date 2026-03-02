import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";
import { updateProfile } from "../features/authSlice.jsx";

const COUNTRY_CODES = ["+968", "+971", "+966", "+974", "+973", "+965"];

const splitPhone = (phoneNum) => {
  if (!phoneNum) return { code: "+968", local: "" };
  const s = String(phoneNum);

  // assume last 8 digits are local number
  const local = s.slice(-8);
  const prefix = s.slice(0, -8);

  const code = COUNTRY_CODES.find((c) => c.replace("+", "") === prefix) || "+968";
  return { code, local };
};

const isValidEmail = (email) => {
  // same behavior as HTML email, but stricter check so khalid@ is invalid
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  // form
  const [form, setForm] = useState({
    fName: "",
    email: "",
    Age: "",
    gender: "",
    bloodType: "",
    address: "",
  });

  // phone like Register.jsx
  const [countryCode, setCountryCode] = useState("+968");
  const [phoneLocal, setPhoneLocal] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const { code, local } = splitPhone(user.phoneNum);

    setForm({
      fName: user.fName || "",
      email: user.email || "",
      Age: user.Age ?? "",
      gender: user.gender || "",
      bloodType: user.bloodType || "",
      address: user.address || "",
    });

    setCountryCode(code);
    setPhoneLocal(local);
    setPhoneError("");
  }, [user]);

  const initialLetter = useMemo(() => {
    if (!user) return "U";
    return (user.fName ? user.fName.charAt(0) : user.email?.charAt(0) || "U").toUpperCase();
  }, [user]);

  if (!user) return null;

  const onChange = (e) => {
    const { name, value } = e.target;

    // same as Register.jsx phone validation: numeric + max 8 digits
    if (name === "phoneLocal") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 8) return;
      setPhoneLocal(numericValue);

      if (numericValue.length === 8) setPhoneError("");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onCancel = () => {
    setIsEditing(false);
    const { code, local } = splitPhone(user.phoneNum);

    setForm({
      fName: user.fName || "",
      email: user.email || "",
      Age: user.Age ?? "",
      gender: user.gender || "",
      bloodType: user.bloodType || "",
      address: user.address || "",
    });

    setCountryCode(code);
    setPhoneLocal(local);
    setPhoneError("");
  };

  const validateLikeRegister = () => {
    // required
    const requiredFields = ["fName", "email", "Age", "gender", "bloodType", "address"];
    for (const field of requiredFields) {
      if (!String(form[field] ?? "").trim()) {
        alert(`Please fill out the ${field}`);
        return false;
      }
    }

    // full name max 20
    if (String(form.fName).length > 20) {
      alert("Full Name must be max 20 letters.");
      return false;
    }

    // email format
    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address (example: name@gmail.com).");
      return false;
    }

    // phone exactly 8 digits
    if (phoneLocal.length !== 8) {
      setPhoneError("Phone number must be exactly 8 digits.");
      return false;
    }

    // age min 18
    const ageNum = Number(form.Age);
    if (!Number.isFinite(ageNum) || ageNum < 18) {
      alert("Age must be 18 or above.");
      return false;
    }

    return true;
  };

  const onSave = async () => {
    if (!validateLikeRegister()) return;

    const numericCode = countryCode.replace("+", "");
    const fullPhone = Number(`${numericCode}${phoneLocal}`);

    const updates = {
      ...form,
      phoneNum: fullPhone,
      Age: String(form.Age), // your schema stores Age as String
    };

    const res = await dispatch(updateProfile({ userId: user._id, updates }));
    if (updateProfile.fulfilled.match(res)) {
      alert("Profile updated successfully");
      setIsEditing(false);
    } else {
      alert(res.payload || "Update failed");
    }
  };

  return (
    <div className="profile-page">
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={bdmslogo}
              alt="BDMS Logo"
              style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover" }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <span className="nav-link active-link">My Profile</span>
          </nav>
        </div>
      </header>

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0">My Profile</h5>
                <div className="d-flex gap-2">
                  <Link to="/home" className="btn btn-sm btn-outline-secondary">
                    Back to Home
                  </Link>
                  <Link to="/forget-password" className="btn btn-sm btn-outline-secondary">
                    Reset Password
                  </Link>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="profile-icon rounded-circle me-3 d-flex align-items-center justify-content-center">
                    {initialLetter}
                  </div>
                  <div className="flex-grow-1">
                    <h4 className="mb-0">{user.fName || "User"}</h4>
                    <small className="text-muted">{user.email}</small>
                  </div>

                  {!isEditing ? (
                    <button className="btn btn-outline-primary" onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" disabled={loading} onClick={onSave}>
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button className="btn btn-outline-secondary" disabled={loading} onClick={onCancel}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Full Name</dt>
                    <dd className="col-sm-8">{user.fName}</dd>

                    <dt className="col-sm-4">Email</dt>
                    <dd className="col-sm-8">{user.email}</dd>

                    <dt className="col-sm-4">Phone Number</dt>
                    <dd className="col-sm-8">{user.phoneNum}</dd>

                    <dt className="col-sm-4">Age</dt>
                    <dd className="col-sm-8">{user.Age}</dd>

                    <dt className="col-sm-4">Gender</dt>
                    <dd className="col-sm-8">{user.gender}</dd>

                    <dt className="col-sm-4">Blood Type</dt>
                    <dd className="col-sm-8">{user.bloodType}</dd>

                    <dt className="col-sm-4">Role</dt>
                    <dd className="col-sm-8">{user.role}</dd>

                    <dt className="col-sm-4">Address</dt>
                    <dd className="col-sm-8">{user.address}</dd>
                  </dl>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        name="fName"
                        value={form.fName}
                        onChange={onChange}
                        maxLength={20}
                        required
                      />
                      <small className="text-muted">Max 20 letters.</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        required
                      />
                    </div>

                    {/* Phone same as Register */}
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <div className="row g-2">
                        <div className="col-4">
                          <select
                            className="form-select"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                          >
                            {COUNTRY_CODES.map((c) => (
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
                            onChange={onChange}
                            required
                          />
                          {phoneError && <small className="text-danger">{phoneError}</small>}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-control"
                        name="Age"
                        value={form.Age}
                        onChange={onChange}
                        min="18"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={form.gender}
                        onChange={onChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Blood Type</label>
                      <select
                        className="form-select"
                        name="bloodType"
                        value={form.bloodType}
                        onChange={onChange}
                        required
                      >
                        <option value="">Select blood type</option>
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

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input className="form-control" value={user.role} disabled readOnly />
                      <div className="form-text">Role cannot be changed.</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        name="address"
                        value={form.address}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;