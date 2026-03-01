import React from "react";
import AdminNavbar from "./AdminNavbar";

const AdminProfile = () => {
  const admin = JSON.parse(localStorage.getItem("bdmsUser"));

  if (!admin) return <h3>No admin logged in</h3>;

  return (
    <div>
      <AdminNavbar />

      <div className="container py-5">
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
    </div>
  );
};

export default AdminProfile;
