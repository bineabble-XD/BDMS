import React, { useState } from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const HospitalProfile = () => {
  const storedHospital = JSON.parse(localStorage.getItem("bdmsUser"));

  const [hospital, setHospital] = useState(storedHospital);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fName: storedHospital?.fName || "",
    email: storedHospital?.email || "",
    phoneNum: storedHospital?.phoneNum || "",
    address: storedHospital?.address || "",
  });

  if (!hospital) return <h3>No hospital logged in</h3>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      fName: hospital?.fName || "",
      email: hospital?.email || "",
      phoneNum: hospital?.phoneNum || "",
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
        setError("User ID not found.");
        setSaving(false);
        return;
      }

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updates: {
            fName: formData.fName,
            email: formData.email,
            phoneNum: formData.phoneNum,
            address: formData.address,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile.");
        setSaving(false);
        return;
      }

      const updatedUser = data.user;
      setHospital(updatedUser);
      localStorage.setItem("bdmsUser", JSON.stringify(updatedUser));
      setMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
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
          <h4 className="fw-bold mb-0">Hospital Profile</h4>
        </div>

        <Link to="/hospital-dash" className="btn btn-outline-secondary">
          Back
        </Link>
      </header>

      <div className="card shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Hospital Information</h3>

          {!isEditing ? (
            <button type="button" className="btn btn-danger" onClick={handleEditClick}>
              Edit
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <hr />

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-warning">{error}</div>}

        <dl className="row">
          <dt className="col-sm-3">Hospital Name</dt>
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

          <dt className="col-sm-3">Email</dt>
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

          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">
            {isEditing ? (
              <input
                type="text"
                name="phoneNum"
                className="form-control"
                value={formData.phoneNum}
                onChange={handleChange}
              />
            ) : (
              hospital.phoneNum || "91177010"
            )}
          </dd>

          <dt className="col-sm-3">Role</dt>
          <dd className="col-sm-9">Hospital</dd>

          <dt className="col-sm-3">Blood Type</dt>
          <dd className="col-sm-9">N/A</dd>

          <dt className="col-sm-3">Address</dt>
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

          <dt className="col-sm-3">Status</dt>
          <dd className="col-sm-9">
            {hospital.isAdmin ? "Administrator" : "Standard User"}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default HospitalProfile;