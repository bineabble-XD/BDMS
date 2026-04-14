import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/11+.png";
import { useLanguage } from "../context/LanguageContext";

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

const buildRequestFromBooking = (item) => {
  const donor = item.donor || {};
  const hospital = item.hospital || {};
  return {
    name: donor.fName || "Donor",
    donorType: item.bloodType || donor.bloodType || "—",
    requested: formatDate(item.appointmentDate),
    reason: "Scheduled donation appointment.",
    ageGender: "—",
    email: donor.email || "—",
    phone: donor.phoneNum ? `+${donor.phoneNum}` : "—",
    eligible: true,
    previousDate: "—",
    previousHospital: hospital.hospitalName || "—",
  };
};

const AdminAppoint = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [searchName, setSearchName] = useState("");

  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
  const userId = user?._id || user?.id;
  const isAdmin = user?.isAdmin === true;

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/all`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
        setPending(data.pending || []);
        setCompleted(data.completed || []);
      }
    } catch (err) {
      console.error("AdminAppoint fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmDonation = async (booking) => {
    if (!userId || !booking) return;
    setBusyId(booking._id);
    try {
      const res = await fetch(`${API_BASE}/bookings/${booking._id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin }),
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

  const allAppointments = [...appointments, ...completed];
  const filterByName = (list) =>
    list.filter((item) => {
      const name = (item.donor?.fName || "Donor").toLowerCase();
      const q = searchName.trim().toLowerCase();
      return !q || name.includes(q);
    });
  const filteredAppointments = filterByName(allAppointments);
  const filteredPending = filterByName(pending);

  return (
    <div className="admin-app-page">
      <main className="admin-app-main">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h3 className="fw-semibold mb-1">{t("adminAppointmentsOverview")}</h3>
              <p className="text-muted small mb-0">
                Review booked donations and manage incoming requests.
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
                      Scheduled and completed donations
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
                    <span className="badge rounded-pill text-bg-light">
                      {allAppointments.length} total
                    </span>
                  </div>
                </div>

                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : allAppointments.length === 0 ? (
                  <p className="text-muted">No appointments.</p>
                ) : filteredAppointments.length === 0 ? (
                  <p className="text-muted">No matches for &quot;{searchName}&quot;.</p>
                ) : (
                  filteredAppointments.map((item) => {
                    const donor = item.donor || {};
                    const hospital = item.hospital || {};
                    const name = donor.fName || "Donor";
                    const hospitalName = hospital.hospitalName || "Hospital";
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
                            <div className="text-muted small">{hospitalName} • {item.bloodType}</div>
                          </div>
                          <div className="text-muted small me-3">{formatDate(item.appointmentDate)}</div>
                          <div className="d-flex gap-1 align-items-center flex-wrap">
                            {!isCompleted && isAdmin && (
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
                            <Link
                              to="/AdminManRequest"
                              state={{
                                context: "appointment",
                                request: buildRequestFromBooking(item),
                                item,
                              }}
                              className="btn btn-link p-0 admin-link"
                            >
                              View &gt;
                            </Link>
                          </div>
                        </div>
                        <hr className="my-1" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="admin-app-illustration text-center mb-3">
                <img
                  src={heroImg}
                  alt="Admin illustration"
                  className="img-fluid admin-app-img"
                />
              </div>

              <div className="admin-requests-card p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Pending requests</h6>
                  <span className="badge rounded-pill text-bg-danger-subtle">
                    {pending.length} pending
                  </span>
                </div>

                {pending.length === 0 ? (
                  <p className="text-muted small mb-0">No pending requests.</p>
                ) : (
                  filteredPending.map((item) => {
                    const donor = item.donor || {};
                    const hospital = item.hospital || {};
                    return (
                      <div key={item._id}>
                        <div className="admin-req-row d-flex justify-content-between align-items-center py-2">
                          <div>
                            <div className="fw-semibold small">{donor.fName || "Donor"}</div>
                            <div className="text-muted small">
                              {formatDate(item.appointmentDate)} • {hospital.hospitalName || "—"}
                            </div>
                          </div>
                          <Link
                            to="/AdminManRequest"
                            state={{
                              context: "request",
                              request: buildRequestFromBooking(item),
                              item,
                            }}
                            className="btn btn-link p-0 admin-link small"
                          >
                            Manage
                          </Link>
                        </div>
                        <hr className="my-1" />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAppoint;
