import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";

const defaultRequest = {
  name: "Abbas Al Lawati",
  donorType: "O+",
  requested: "Nov 24, 2025, 8:00 AM",
  reason: "Scheduled follow-up donation as per previous visit.",
  ageGender: "23 – Male",
  email: "abbas@gmail.com",
  phone: "+968 99998888",
  eligible: true,
  previousDate: "Aug 12, 2025",
  previousHospital: "Royal Hospital",
};

const AdminManageRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const context = location.state?.context || "request";
  const request = location.state?.request || defaultRequest;

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/admin-appointments");
  };

  const title =
    context === "appointment" ? "Manage Appointment" : "Manage Request";

  const reasonLabel =
    context === "appointment" ? "Reason for Appointment" : "Reason for Request";

  return (
    <div className="manage-req-page">
      <AdminNavbar />

      <div className="container mt-4">

        <button onClick={goBack} className="manage-back-btn d-flex align-items-center gap-2 mb-2">
          <FiArrowLeft size={20} /> Back
        </button>

        <h4 className="fw-semibold mb-3">{title}</h4>

        <div className="manage-card">
          <div className="row">

            <div className="col-md-8 left-details">
              <h6 className="fw-bold mb-1">{request.name}</h6>

              <p className="mb-1">
                <strong>Donor Type:</strong> {request.donorType}
              </p>

              <p className="mb-3">
                <strong>Requested:</strong> {request.requested}
              </p>

              <div className="mb-2 fw-semibold">{reasonLabel}</div>

              <input
                type="text"
                className="form-control mb-3"
                value={request.reason || ""}
                readOnly
              />
            </div>

            <div className="col-md-4 right-details">
              <p className="mb-1 fw-semibold">{request.ageGender}</p>

              <p className="mb-1">📧 {request.email}</p>
              <p className="mb-3">📞 {request.phone}</p>

              <p className={request.eligible ? "eligible" : "not-eligible"}>
                {request.eligible ? "Eligible" : "Not Eligible"}
              </p>

              <p className="fw-semibold mb-1">Previous Donations</p>
              <p className="mb-0">{request.previousDate}</p>
              <p className="text-muted">{request.previousHospital}</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminManageRequest;
