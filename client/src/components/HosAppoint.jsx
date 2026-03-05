import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/11+.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const isAppointmentReached = (appointmentDate) => {
  if (!appointmentDate) return false;
  return new Date() >= new Date(appointmentDate);
};

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

const HosAppoint = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [searchName, setSearchName] = useState("");

  const user = JSON.parse(localStorage.getItem("bdmsUser"));
  const userId = user?._id || user?.id;

  const fetchData = async () => {
    if (!userId) return;
    try {
      const bookingsRes = await fetch(`${API_BASE}/bookings/hospital/${userId}`);
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        const upcoming = data.appointments || [];
        const done = data.completed || [];
        setAppointments([...upcoming, ...done]);
      }
    } catch (err) {
      console.error("HosAppoint fetch error:", err);
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

  const handleCancel = async (bookingId) => {
    if (!bookingId || !userId) return;
    setBusyId(bookingId);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) await fetchData();
      else alert(data?.message || "Failed to cancel");
    } catch (err) {
      alert("Network error");
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDonation = async (booking) => {
    if (!userId || !booking) return;
    setBusyId(booking._id);
    try {
      const res = await fetch(`${API_BASE}/bookings/${booking._id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchData();
      } else {
        alert(data?.message || "Failed to confirm donation");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = 0; // Pending are in HosDash; this page focuses on appointments

  return (
    <div className="admin-app-page">
      <main className="admin-app-main">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h3 className="fw-semibold mb-1">Appointments overview</h3>
              <p className="text-muted small mb-0">
                Review upcoming donations and confirm completed donations.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="admin-app-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                  <div>
                    <h5 className="mb-1">Appointments</h5>
                    <span className="text-muted small">
                      Approved scheduled donations
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Search by name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      style={{ width: "180px" }}
                    />
                    <span className="badge rounded-pill text-bg-light">{appointments.length} total</span>
                  </div>
                </div>

                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-muted">No appointments.</p>
                ) : (() => {
                  const filtered = appointments.filter((item) => {
                    const name = (item.donor?.fName || "Donor").toLowerCase();
                    const q = searchName.trim().toLowerCase();
                    return !q || name.includes(q);
                  });
                  if (filtered.length === 0) {
                    return <p className="text-muted">No matches for &quot;{searchName}&quot;.</p>;
                  }
                  return filtered.map((item) => {
                    const donor = item.donor || {};
                    const name = donor.fName || "Donor";
                    const hospitalName = item.hospital?.hospitalName || "Hospital";
                    const isCompleted = item.status === "completed";
                    const canConfirm = isAppointmentReached(item.appointmentDate);
                    return (
                      <div key={item._id}>
                        <div className="admin-app-row d-flex align-items-center justify-content-between py-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span className="fw-semibold">{name}</span>
                              <span className="d-inline-flex align-items-center gap-1">
                                <span className={`rounded-circle d-inline-block ${isCompleted ? "bg-success" : "bg-warning"}`} style={{ width: 8, height: 8 }} />
                                {isCompleted ? "Completed" : "Pending donation"}
                              </span>
                            </div>
                            <div className="text-muted small">
                              {donor.email}
                              {donor.phoneNum && ` • ${donor.phoneNum}`}
                            </div>
                            <div className="text-muted small">{hospitalName} • {item.bloodType}</div>
                          </div>

                          <div className="text-muted small me-3">{formatDate(item.appointmentDate)}</div>

                          <div className="d-flex gap-1 align-items-center flex-wrap">
                            {!isCompleted && (
                              <button
                                className="btn btn-success btn-sm"
                                style={{ minWidth: "100px" }}
                                disabled={!!busyId || !canConfirm}
                                onClick={() => handleConfirmDonation(item)}
                                title={!canConfirm ? "Confirm only when the appointment date/time has been reached" : ""}
                              >
                                {busyId === item._id ? "..." : "Confirm"}
                              </button>
                            )}
                            {!isCompleted && (
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                style={{ minWidth: "100px" }}
                                disabled={!!busyId}
                                onClick={() => handleCancel(item._id)}
                              >
                                {busyId === item._id ? "..." : "Cancel"}
                              </button>
                            )}
                            <Link
                              to="/HosManRequest"
                              state={{ item }}
                              className="btn btn-link p-0 admin-link"
                            >
                              Manage
                            </Link>
                          </div>
                        </div>
                        <hr className="my-1" />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="admin-app-illustration mb-3">
                <img
                  src={heroImg}
                  alt="Illustration"
                  className="img-fluid admin-app-img"
                />
              </div>

              <div className="admin-requests-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Urgent requests</h6>
                  <Link to="/urgent-requests" className="btn btn-link p-0 admin-link small">
                    View / Create
                  </Link>
                </div>
                <p className="text-muted small mb-0">
                  Post urgent blood supply requests from the Urgent Requests page. Donors can book appointments directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HosAppoint;
