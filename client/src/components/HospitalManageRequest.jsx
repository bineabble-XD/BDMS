import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [completing, setCompleting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Comes from HosAppoint.jsx: state={{ item }}
  const booking = location.state?.item || location.state?.p;

  let user = null;
  try {
    const raw =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("bdmsUser")
        : null;
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }
  const userId = user?._id || user?.id;

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

  const handleStatusUpdate = async (status, reason) => {
    try {
      const body = { status, userId };
      if (status === "rejected") body.rejectionReason = reason || "";
      const res = await fetch(`${API_BASE}/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.message || "Failed to update booking");

      alert(`Booking ${status} successfully`);
      setShowRejectModal(false);
      setRejectionReason("");
      navigate("/hospital-dash");
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="admin-app-page">
      <main className="admin-app-main">
        <div className="container py-4">
          <h2 className="mb-3">{t("manageRequest")}</h2>

          <div className="card p-4 shadow-sm">
            <div className="d-flex flex-wrap justify-content-between gap-3">
              <div>
                <h4 className="mb-2">{donorName}</h4>

                <p className="mb-1">
                  <strong>{t("appointment")}:</strong> {appointmentDate}
                </p>

                <p className="mb-1">
                  <strong>{t("bloodType")}:</strong> {bloodType}
                </p>

                <p className="mb-1">
                  <strong>{t("navNotifHospital")}:</strong> {hospital.hospitalName || "—"}
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

            <h6 className="mb-2">{t("eligibilityReason")}</h6>
            <textarea
              className="form-control"
              rows={6}
              readOnly
              value={formatEligibility(booking.eligibility)}
            />

            {booking.status === "pending" && (
              <div className="d-flex gap-3 mt-3">
                <button className="btn btn-danger" onClick={() => handleStatusUpdate("approved")}>
                  {t("approve")}
                </button>
                <button className="btn btn-outline-dark" onClick={() => setShowRejectModal(true)}>
                  {t("decline")}
                </button>
              </div>
            )}

            {showRejectModal && (
              <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1} onClick={() => setShowRejectModal(false)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{t("declineModalTitle")}</h5>
                      <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)} aria-label="Close" />
                    </div>
                    <div className="modal-body">
                      <p className="text-muted small mb-2">
                        {t("declineModalDesc")}
                      </p>
                      <label className="form-label">{t("rejectReasonLabel")} <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="e.g. No available slots at requested time, donor eligibility concerns..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={!rejectionReason.trim()}
                        onClick={() => handleStatusUpdate("rejected", rejectionReason.trim())}
                      >
                        {t("decline")}
                      </button>
                    </div>
                  </div>
                </div>
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