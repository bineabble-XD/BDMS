import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Muscat",
  });
};

const formatEligibility = (eligibility) => {
  if (!eligibility) return "No eligibility info provided.";

  const lines = [];
  if (eligibility.donatedBefore !== undefined)
    lines.push(`Donated before: ${eligibility.donatedBefore ? "Yes" : "No"}`);
  if (eligibility.lastDonationMonth)
    lines.push(`Last donation month: ${eligibility.lastDonationMonth}`);
  if (eligibility.sickPast3Months !== undefined)
    lines.push(`Sick in past 3 months: ${eligibility.sickPast3Months ? "Yes" : "No"}`);
  if (eligibility.medsRecently)
    lines.push(`Meds recently: ${eligibility.medsRecently}`);
  if (eligibility.hasColdFluFever)
    lines.push(`Cold/Flu/Fever: ${eligibility.hasColdFluFever}`);
  if (eligibility.medicalRestriction)
    lines.push(`Medical restrictions: ${eligibility.medicalRestriction}`);

  return lines.length ? lines.join("\n") : "No eligibility info provided.";
};

const HospitalManageRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Comes from HosAppoint.jsx: state={{ item }}
  const booking = location.state?.item || location.state?.p;

  if (!booking) {
    return (
      <div className="container py-5">
        <h3>No appointment selected</h3>
        <Link to="/hospital-appointments" className="btn btn-secondary mt-3">
          Back
        </Link>
      </div>
    );
  }

  const donor = booking.donor || {};
  const hospital = booking.hospital || {};

  const donorName = donor.fName ? donor.fName : "Donor";
  const donorEmail = donor.email || "—";
  const donorPhone = donor.phoneNum ? `+${donor.phoneNum}` : "—";
  const donorAge = donor.Age || "—";
  const donorGender = donor.gender || "—";

  const bloodType = booking.bloodType || donor.bloodType || "—";
  const appointmentDate = booking.appointmentDate ? formatDate(booking.appointmentDate) : "—";
  const canConfirmDonation = booking.appointmentDate && new Date() >= new Date(booking.appointmentDate);

  // Optional actions (only if you want them)
  const user = JSON.parse(localStorage.getItem("bdmsUser"));
  const userId = user?._id || user?.id;

  const [completing, setCompleting] = useState(false);

  const handleConfirmDonation = async () => {
    if (!userId || booking.status !== "approved") return;
    setCompleting(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${booking._id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert("Donation confirmed. Blood added to stock.");
        navigate("/hospital-appointments");
      } else {
        alert(data?.message || "Failed to confirm donation");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setCompleting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.message || "Failed to update booking");

      alert(`Booking ${status} successfully`);
      navigate("/hospital-dash");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="admin-app-page">
      <main className="admin-app-main">
        <div className="container py-4">
          <h2 className="mb-3">Manage Request</h2>

          <div className="card p-4 shadow-sm">
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div>
                <h4 className="mb-2">{donorName}</h4>

                <p className="mb-1">
                  <strong>Appointment:</strong> {appointmentDate}
                </p>

                <p className="mb-1">
                  <strong>Blood Type:</strong> {bloodType}
                </p>

                <p className="mb-1">
                  <strong>Hospital:</strong> {hospital.hospitalName || "—"}
                </p>

                <p className="mb-0">
                  <strong>Status:</strong>{" "}
                  {(() => {
                    const s = booking.status;
                    const c = s === "completed" ? { dot: "bg-success", label: "Completed" }
                      : s === "approved" ? { dot: "bg-warning", label: "Pending donation" }
                      : s === "rejected" || s === "cancelled" ? { dot: "bg-danger", label: "Cancelled" }
                      : { dot: "bg-secondary", label: s || "—" };
                    return (
                      <span className="d-inline-flex align-items-center gap-1">
                        <span className={`rounded-circle d-inline-block ${c.dot}`} style={{ width: 8, height: 8 }} />
                        {c.label}
                      </span>
                    );
                  })()}
                </p>
              </div>

              <div className="text-end">
                <p className="mb-1">
                  {donorAge} - {donorGender}
                </p>
                <p className="mb-1">📧 {donorEmail}</p>
                <p className="mb-0">📞 {donorPhone}</p>
              </div>
            </div>

            <hr />

            <h6 className="mb-2">Eligibility / Reason</h6>
            <textarea
              className="form-control"
              rows={6}
              readOnly
              value={formatEligibility(booking.eligibility)}
            />

            {booking.status === "pending" && (
              <div className="d-flex gap-3 mt-3">
                <button className="btn btn-danger" onClick={() => handleStatusUpdate("approved")}>
                  Approve
                </button>
                <button className="btn btn-outline-dark" onClick={() => handleStatusUpdate("rejected")}>
                  Decline
                </button>
              </div>
            )}
            {booking.status === "approved" && (
              <div className="d-flex gap-3 mt-3">
                <button
                  className="btn btn-success"
                  disabled={completing || !canConfirmDonation}
                  onClick={handleConfirmDonation}
                  title={!canConfirmDonation ? "Confirm only when the appointment date/time has been reached" : ""}
                >
                  {completing ? "..." : "Confirm donation (add to stock)"}
                </button>
                {!canConfirmDonation && (
                  <small className="text-muted align-self-center">
                    Wait until the scheduled date/time to confirm.
                  </small>
                )}
              </div>
            )}
          </div>

          <div className="mt-3">
            <Link to="/hospital-appointments" className="btn btn-secondary">
              Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HospitalManageRequest;