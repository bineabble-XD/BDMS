import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const HospitalProfile = () => {
  const hospital = JSON.parse(localStorage.getItem("bdmsUser"));

  if (!hospital) return <h3>No hospital logged in</h3>;

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
          <h4 className="fw-bold">Hospital Profile</h4>
        </div>

        <Link to="/hospital-dash" className="btn btn-outline-secondary">
          Back
        </Link>
      </header>

      <div className="card shadow p-4">
        <h3>Hospital Information</h3>
        <hr />

        <dl className="row">
          <dt className="col-sm-3">Hospital Name</dt>
          <dd className="col-sm-9">{hospital.fName || "City Hospital"}</dd>

          <dt className="col-sm-3">Email</dt>
          <dd className="col-sm-9">{hospital.email || "hospital2@gmail.com"}</dd>

          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">{hospital.phoneNum || "91177010"}</dd>

          <dt className="col-sm-3">Role</dt>
          <dd className="col-sm-9">Hospital</dd>

          <dt className="col-sm-3">Blood Type</dt>
          <dd className="col-sm-9">N/A</dd>

          <dt className="col-sm-3">Address</dt>
          <dd className="col-sm-9">{hospital.address || "Amerat"}</dd>

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
