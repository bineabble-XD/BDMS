import React from "react";
import { Link } from "react-router-dom";
import bdmslogo from "../assets/bdmslogo.png";

const AdminProfile = () => {
  const admin = JSON.parse(localStorage.getItem("bdmsUser"));

  if (!admin) return <h3>No admin logged in</h3>;

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
          <h4 className="fw-bold">BDMS Admin</h4>
        </div>

        <Link to="/dashboard" className="btn btn-outline-secondary">
          Back
        </Link>
      </header>

      <div className="card shadow p-4">
        <h3>Admin Profile</h3>
        <hr />

        <dl className="row">
          <dt className="col-sm-3">Full Name</dt>
          <dd className="col-sm-9">{admin.fName}</dd>

          <dt className="col-sm-3">Email</dt>
          <dd className="col-sm-9">{admin.email}</dd>

          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">{admin.phoneNum}</dd>

          <dt className="col-sm-3">Role</dt>
          <dd className="col-sm-9">{admin.role}</dd>

          <dt className="col-sm-3">Blood Type</dt>
          <dd className="col-sm-9">{admin.bloodType}</dd>

          <dt className="col-sm-3">Address</dt>
          <dd className="col-sm-9">{admin.address}</dd>

          <dt className="col-sm-3">Admin Status</dt>
          <dd className="col-sm-9">
            {admin.isAdmin ? "Administrator" : "Standard User"}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default AdminProfile;
