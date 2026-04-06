import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/9+.png";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const HosDash = () => {
  const { t } = useLanguage();
  const [completedDonations, setCompletedDonations] = useState([]);
  const [pending, setPending] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const user = JSON.parse(localStorage.getItem("bdmsUser"));
  const userId = user?._id || user?.id;

  const fetchData = async () => {
    if (!userId) return;
    try {
      const [bookingsRes, urgentRes] = await Promise.all([
        fetch(`${API_BASE}/bookings/hospital/${userId}`),
        fetch(`${API_BASE}/urgent-requests/hospital/${userId}`),
      ]);
      if (bookingsRes.ok) {
        const { completed: c, pending: p, appointments: a } = await bookingsRes.json();
        setCompletedDonations(c || []);
        setPending(p || []);
        setAppointments(a || []);
      }
      if (urgentRes.ok) {
        const data = await urgentRes.json();
        setUrgentRequests(data || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [userId]);

  const handleStatusUpdate = async (bookingId, status, reason) => {
    if (!userId) return;
    setUpdatingId(bookingId);
    try {
      const body = { status, userId };
      if (status === "rejected") body.rejectionReason = reason || "";
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setRejectModal(null);
        setRejectionReason("");
        await fetchData();
      } else {
        alert(data?.message || "Failed to update");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  const openRejectModal = (booking) => {
    setRejectModal(booking);
    setRejectionReason("");
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "Asia/Muscat",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="dashboard-card p-4 mb-4">
                <h5 className="mb-3">{t("bookingRequests")}</h5>
                {loading ? (
                  <p className="text-muted">{t("loading")}</p>
                ) : pending.length === 0 ? (
                  <p className="text-muted">{t("noPendingRequests")}</p>
                ) : (
                  pending.map((b) => (
                    <div key={b._id} className="d-flex justify-content-between align-items-center mb-2 py-2 border-bottom">
                      <div>
                        <span className="fw-semibold">{b.donor?.fName || "Donor"}</span>
                        <span className="text-muted ms-2">— {b.bloodType} • {formatDate(b.appointmentDate)}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" disabled={updatingId === b._id} onClick={() => handleStatusUpdate(b._id, "approved")}>
                          {updatingId === b._id ? "..." : t("approve")}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" disabled={updatingId === b._id} onClick={() => openRejectModal(b)}>
                          {t("reject")}
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div className="pb-3 mb-3 border-bottom" />

                <h5 className="mb-3">{t("lastDonations")}</h5>

                {loading ? (
                  <p className="text-muted">{t("loading")}</p>
                ) : completedDonations.length === 0 ? (
                  <p className="text-muted">{t("noCompletedDonations")}</p>
                ) : (
                  <>
                    {completedDonations.map((d) => (
                      <div
                        key={d._id}
                        className="d-flex justify-content-between mb-2"
                      >
                        <span className="fw-semibold">
                          {d.donor?.fName || "Donor"} — {d.bloodType}
                        </span>
                        <span>{formatDate(d.appointmentDate)}</span>
                      </div>
                    ))}
                    <div className="pb-3 mb-3 border-bottom" />
                  </>
                )}

                <h6 className="mb-3">{t("urgentBloodRequests")}</h6>

                {loading ? (
                  <p className="text-muted small">{t("loading")}</p>
                ) : urgentRequests.length === 0 ? (
                  <p className="text-muted small">{t("noUrgentPosted")}</p>
                ) : (
                  <>
                    {urgentRequests.map((ur) => (
                      <div
                        key={ur._id}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="urgent-dot" />
                            <span className="fw-semibold small">{ur.bloodType}</span>
                            <span className="text-muted small">× {ur.quantity || 1}</span>
                          </div>
                        </div>
                        <Link
                          to="/urgent-requests"
                          className="btn btn-link p-0 dashboard-view-link"
                        >
                          View &gt;
                        </Link>
                      </div>
                    ))}
                  </>
                )}

                <Link
                  to="/urgent-requests"
                  className="btn btn-link p-0 dashboard-view-link mt-2"
                >
                  {urgentRequests.length > 0 ? t("viewAll") : t("createRequest")}&nbsp;&gt;
                </Link>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dashboard-side-top text-center mb-3">
                <img
                  src={heroImg}
                  alt="Dashboard illustration"
                  className="img-fluid dashboard-illustration"
                />
              </div>

              <div className="dashboard-side-card p-3">
                <h6 className="mb-3 text-center">{t("appointments")}</h6>

                {loading ? (
                  <p className="text-muted small">{t("loading")}</p>
                ) : appointments.length === 0 ? (
                  <p className="text-muted small">{t("noUpcomingAppointments")}</p>
                ) : (
                  appointments.map((a) => (
                    <div key={a._id} className="d-flex justify-content-between mb-2">
                      <span>{a.donor?.fName || "Donor"}</span>
                      <span>{formatDate(a.appointmentDate)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {rejectModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1} onClick={() => setRejectModal(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("rejectModalTitle")}</h5>
                <button type="button" className="btn-close" onClick={() => setRejectModal(null)} aria-label="Close" />
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-2">
                  {t("rejectModalDesc")} <strong>{rejectModal.donor?.fName || "Donor"}</strong>. {t("rejectModalDonorEmail")}
                </p>
                <label className="form-label">{t("rejectReasonLabel")} <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="e.g. No available slots at requested time, donor eligibility concerns..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectModal(null)}>
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={!rejectionReason.trim() || updatingId === rejectModal._id}
                  onClick={() => handleStatusUpdate(rejectModal._id, "rejected", rejectionReason.trim())}
                >
                  {updatingId === rejectModal._id ? "..." : t("reject")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HosDash;
