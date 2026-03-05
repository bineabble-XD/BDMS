import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/9+.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const HosDash = () => {
  const [completedDonations, setCompletedDonations] = useState([]);
  const [pending, setPending] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  const handleStatusUpdate = async (bookingId, status) => {
    if (!userId) return;
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) await fetchData();
      else alert(data?.message || "Failed to update");
    } catch (err) {
      alert("Network error");
    } finally {
      setUpdatingId(null);
    }
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
                <h5 className="mb-3">Booking Requests</h5>
                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : pending.length === 0 ? (
                  <p className="text-muted">No pending booking requests.</p>
                ) : (
                  pending.map((b) => (
                    <div key={b._id} className="d-flex justify-content-between align-items-center mb-2 py-2 border-bottom">
                      <div>
                        <span className="fw-semibold">{b.donor?.fName || "Donor"}</span>
                        <span className="text-muted ms-2">— {b.bloodType} • {formatDate(b.appointmentDate)}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm" disabled={updatingId === b._id} onClick={() => handleStatusUpdate(b._id, "approved")}>
                          {updatingId === b._id ? "..." : "Approve"}
                        </button>
                        <button className="btn btn-outline-danger btn-sm" disabled={updatingId === b._id} onClick={() => handleStatusUpdate(b._id, "rejected")}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div className="pb-3 mb-3 border-bottom" />

                <h5 className="mb-3">Last Donations</h5>

                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : completedDonations.length === 0 ? (
                  <p className="text-muted">No completed donations yet.</p>
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

                <h6 className="mb-3">Urgent Blood Requests</h6>

                {loading ? (
                  <p className="text-muted small">Loading...</p>
                ) : urgentRequests.length === 0 ? (
                  <p className="text-muted small">No urgent requests posted. Create one to request blood supply.</p>
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
                  {urgentRequests.length > 0 ? "View all" : "Create request"}&nbsp;&gt;
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
                <h6 className="mb-3 text-center">Appointments</h6>

                {loading ? (
                  <p className="text-muted small">Loading...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-muted small">No upcoming appointments.</p>
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
    </div>
  );
};

export default HosDash;
