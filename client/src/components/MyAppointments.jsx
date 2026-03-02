import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:5050";

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleString();
};

const MyAppointments = () => {
  const { user } = useSelector((state) => state.auth);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // per-card edit mode
  const [editingId, setEditingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

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

  const startReschedule = (booking) => {
    setEditingId(booking._id);

    const dt = new Date(booking.appointmentDate);
    const date = dt.toISOString().slice(0, 10);
    const time = dt.toTimeString().slice(0, 5);

    setNewDate(date);
    setNewTime(time);
  };

  const submitReschedule = async (bookingId) => {
    if (!newDate || !newTime) return alert("Pick a date and time");

    const appointmentDate = new Date(`${newDate}T${newTime}`);

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

      alert("Rescheduled successfully");
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
          {bookings.map((b) => (
            <div key={b._id} className="card shadow-sm">
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
                      <span className="text-capitalize">{b.status}</span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2">
                  {b.status === "pending" && editingId !== b._id && (
                    <>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => startReschedule(b)}
                      >
                        Reschedule
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </button>
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
                        onChange={(e) => setNewDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">New Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
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
                    * Reschedule/Cancel is allowed only while status is pending.
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;