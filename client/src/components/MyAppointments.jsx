import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTodayInOman, getMaxDateInOman, getCurrentMinutesInOman } from "../utils/omanTime";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const TIME_SLOTS = [];
for (let h = 9; h <= 22; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 22 && m > 0) break;
    TIME_SLOTS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleString("en-GB", { timeZone: "Asia/Muscat" });
};

const getStatusDisplay = (status) => {
  const config = {
    completed: { dot: "bg-success", label: "Completed" },
    approved: { dot: "bg-warning", label: "Pending donation" },
    pending: { dot: "bg-secondary", label: "Pending" },
    rejected: { dot: "bg-danger", label: "Cancelled" },
    cancelled: { dot: "bg-danger", label: "Cancelled" },
  };
  const c = config[status] || { dot: "bg-secondary", label: status || "—" };
  return (
    <span className="d-inline-flex align-items-center gap-1">
      <span className={`rounded-circle d-inline-block ${c.dot}`} style={{ width: 8, height: 8 }} />
      {c.label}
    </span>
  );
};

const getDateLabel = (dateStr, today) => {
  if (!dateStr) return "";
  const d = new Date(dateStr).toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" });
  if (d === today) return "Today";
  const tomorrow = new Date(today + "T12:00:00+04:00");
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  if (d === tomorrowStr) return "Tomorrow";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Muscat",
  });
};

const MyAppointments = () => {
  const { user } = useSelector((state) => state.auth);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // per-card edit mode
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/bookings/donor/${user._id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      alert("Failed to load your appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const today = getTodayInOman();
  const maxDate = getMaxDateInOman(14);
  const maxDateObj = new Date(maxDate + "T23:59:59+04:00");
  const editingBooking = bookings.find((b) => b._id === editingId);
  const hospitalId = editingBooking?.hospital?._id || editingBooking?.hospital;

  useEffect(() => {
    if (!editingId || !newDate || !hospitalId) {
      setBookedSlots([]);
      return;
    }
    setSlotsLoading(true);
    const url = `${API_BASE}/api/bookings/slots?hospitalId=${encodeURIComponent(hospitalId)}&date=${newDate}&excludeBookingId=${encodeURIComponent(editingId)}`;
    fetch(url)
      .then((res) => (res.ok ? res.json() : { bookedSlots: [] }))
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [editingId, newDate, hospitalId]);

  useEffect(() => {
    if (!newTime) return;
    if (bookedSlots.includes(newTime)) {
      setNewTime("");
      return;
    }
    if (newDate === today) {
      const currentMinutes = getCurrentMinutesInOman();
      const [h, m] = newTime.split(":").map(Number);
      if (h * 60 + m <= currentMinutes) setNewTime("");
    }
  }, [newDate, newTime, bookedSlots]);

  const getRescheduleTimeSlots = () => {
    let slots = TIME_SLOTS.filter((s) => !bookedSlots.includes(s));
    if (newDate === today) {
      const currentMinutes = getCurrentMinutesInOman();
      slots = slots.filter((slot) => {
        const [h, m] = slot.split(":").map(Number);
        return h * 60 + m > currentMinutes;
      });
    }
    return slots;
  };

  const startReschedule = (booking) => {
    setEditingId(booking._id);
    setBookedSlots([]);

    const dt = new Date(booking.appointmentDate);
    let date = dt.toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" });
    if (date < today) date = today;
    if (date > maxDate) date = maxDate;

    setNewDate(date);
    setNewTime("");
  };

  const submitReschedule = async (bookingId) => {
    if (!newDate || !newTime) return alert("Pick a date and time");

    const [h, m] = newTime.split(":").map(Number);
    if (h < 9 || h > 22 || (h === 22 && m > 0)) {
      return alert("Time must be between 9:00 AM and 10:00 PM");
    }
    if (m % 15 !== 0) {
      return alert("Time must be in 15-minute intervals");
    }

    const appointmentDate = new Date(`${newDate}T${newTime}+04:00`);
    if (appointmentDate > maxDateObj) {
      return alert("Appointment date cannot be more than 2 weeks from today.");
    }

    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: user._id,
          appointmentDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message || "Reschedule failed");

      alert("Rescheduled successfully. The hospital will need to approve the new date.");
      setEditingId(null);
      fetchBookings();
    } catch (e) {
      alert("Network error");
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: user._id }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message || "Cancel failed");

      alert("Cancelled successfully");
      fetchBookings();
    } catch (e) {
      alert("Network error");
    }
  };

  if (!user) {
    return (
      <div className="container py-4">
        <h3>Please login first</h3>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-2">My Appointments</h2>
      <p className="text-muted mb-4">
        View your bookings, reschedule, or cancel.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info">No appointments found.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {(() => {
            const sorted = [...bookings].sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
            let lastDateKey = "";
            return sorted.map((b) => {
              const dateKey = new Date(b.appointmentDate).toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" });
              const showDateHeader = dateKey !== lastDateKey;
              const isFirstGroup = lastDateKey === "";
              if (showDateHeader) lastDateKey = dateKey;
              return (
                <React.Fragment key={b._id}>
                  {showDateHeader && (
                    <h6 className="text-muted fw-semibold mb-2" style={{ marginTop: isFirstGroup ? 0 : "1rem" }}>
                      {getDateLabel(b.appointmentDate, today)}
                    </h6>
                  )}
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-wrap justify-content-between gap-3">
                <div>
                  <h5 className="mb-1">
                    {b.hospital?.hospitalName || "Hospital"}
                  </h5>
                  <div className="text-muted">
                    <div>
                      <strong>Date:</strong> {formatDate(b.appointmentDate)}
                    </div>
                    <div>
                      <strong>Blood Type:</strong> {b.bloodType}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      {getStatusDisplay(b.status)}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2">
                  {(b.status === "pending" || b.status === "approved") && editingId !== b._id && (
                    <>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => startReschedule(b)}
                      >
                        Reschedule
                      </button>
                      {b.status === "pending" && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => cancelBooking(b._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {editingId === b._id && (
                <div className="card-footer bg-white">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">New Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newDate}
                        min={today}
                        max={maxDate}
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">New Time</label>
                      <select
                        className="form-select"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        disabled={slotsLoading}
                      >
                        <option value="">
                          {slotsLoading ? "Loading slots..." : "Select time"}
                        </option>
                        {!slotsLoading && getRescheduleTimeSlots().map((slot) => {
                          const [hr, mn] = slot.split(":").map(Number);
                          const label = hr === 12 ? `12:${String(mn).padStart(2, "0")} PM` : hr < 12 ? `${hr}:${String(mn).padStart(2, "0")} AM` : `${hr - 12}:${String(mn).padStart(2, "0")} PM`;
                          return <option key={slot} value={slot}>{label}</option>;
                        })}
                      </select>
                      {!slotsLoading && getRescheduleTimeSlots().length === 0 && (
                        <small className="text-muted">No slots available. Try another date.</small>
                      )}
                    </div>
                    <div className="col-md-4 d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => submitReschedule(b._id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <small className="text-muted d-block mt-2">
                    * After rescheduling, the hospital must approve the new date.
                  </small>
                </div>
              )}
            </div>
                </React.Fragment>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;