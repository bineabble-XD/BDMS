import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getTodayInOman, getMaxDateInOman, getCurrentMinutesInOman } from "../utils/omanTime";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const TIME_SLOTS = [];
for (let h = 9; h <= 22; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 22 && m > 0) break;
    TIME_SLOTS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

const MyAppointments = () => {
  const { t, language } = useLanguage();
  const { user } = useSelector((state) => state.auth);

  const getStatusDisplay = useCallback(
    (status) => {
      const config = {
        completed: { dot: "bg-success", label: t("statusCompleted") },
        approved: { dot: "bg-warning", label: t("statusPendingDonation") },
        pending: { dot: "bg-secondary", label: t("statusPending") },
        rejected: { dot: "bg-danger", label: t("statusCancelled") },
        cancelled: { dot: "bg-danger", label: t("statusCancelled") },
      };
      const c = config[status] || { dot: "bg-secondary", label: status || "—" };
      return (
        <span className="d-inline-flex align-items-center gap-1">
          <span className={`rounded-circle d-inline-block ${c.dot}`} style={{ width: 8, height: 8 }} />
          {c.label}
        </span>
      );
    },
    [t]
  );

  const getDateLabel = useCallback(
    (dateStr, today) => {
      if (!dateStr) return "";
      const d = new Date(dateStr).toLocaleDateString("en-CA", { timeZone: "Asia/Muscat" });
      if (d === today) return t("dateToday");
      const tomorrow = new Date(today + "T12:00:00+04:00");
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      if (d === tomorrowStr) return t("dateTomorrow");
      const loc = language === "AR" ? "ar-OM" : "en-GB";
      return new Date(dateStr).toLocaleDateString(loc, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Muscat",
      });
    },
    [t, language]
  );

  const formatDate = useCallback(
    (d) => {
      if (!d) return "—";
      const dt = new Date(d);
      const loc = language === "AR" ? "ar-OM" : "en-GB";
      return dt.toLocaleString(loc, { timeZone: "Asia/Muscat" });
    },
    [language]
  );

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
      alert(t("myApptLoadFailed"));
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
    if (!newDate || !newTime) return alert(t("myApptPickDateTime"));

    const [h, m] = newTime.split(":").map(Number);
    if (h < 9 || h > 22 || (h === 22 && m > 0)) {
      return alert(t("myApptTimeRange"));
    }
    if (m % 15 !== 0) {
      return alert(t("apptTime15Min"));
    }

    const appointmentDate = new Date(`${newDate}T${newTime}+04:00`);
    if (appointmentDate > maxDateObj) {
      return alert(t("apptMax2Weeks"));
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

      if (!res.ok) return alert(data.message || t("myApptRescheduleFail"));

      alert(t("myApptRescheduleOk"));
      setEditingId(null);
      fetchBookings();
    } catch (e) {
      alert(t("myApptNetworkError"));
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm(t("myApptCancelConfirm"))) return;

    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: user._id }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message || t("myApptCancelFail"));

      alert(t("myApptCancelOk"));
      fetchBookings();
    } catch (e) {
      alert(t("myApptNetworkError"));
    }
  };

  if (!user) {
    return (
      <div
        className="container py-4"
        dir={language === "AR" ? "rtl" : "ltr"}
        lang={language === "AR" ? "ar" : "en"}
      >
        <h3>{t("myApptLogin")}</h3>
      </div>
    );
  }

  return (
    <div
      className="container py-4"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <h2 className="mb-2">{t("myApptTitle")}</h2>
      <p className="text-muted mb-4">{t("myApptSubtitle")}</p>

      {loading ? (
        <p>{t("loading")}</p>
      ) : bookings.length === 0 ? (
        <div className="alert alert-info">{t("myApptNone")}</div>
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
                    {b.hospital?.hospitalName || t("hospital")}
                  </h5>
                  <div className="text-muted">
                    <div>
                      <strong>{t("myApptDateLabel")}</strong> {formatDate(b.appointmentDate)}
                    </div>
                    <div>
                      <strong>{t("myApptBloodTypeLabel")}</strong> {b.bloodType}
                    </div>
                    <div>
                      <strong>{t("myApptStatusLabel")}</strong>{" "}
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
                        {t("myApptReschedule")}
                      </button>
                      {b.status === "pending" && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => cancelBooking(b._id)}
                        >
                          {t("cancel")}
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
                      <label className="form-label">{t("myApptNewDate")}</label>
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
                      <label className="form-label">{t("myApptNewTime")}</label>
                      <select
                        className="form-select"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        disabled={slotsLoading}
                      >
                        <option value="">
                          {slotsLoading ? t("apptLoadingSlots") : t("apptSelectTime")}
                        </option>
                        {!slotsLoading && getRescheduleTimeSlots().map((slot) => {
                          const [hr, mn] = slot.split(":").map(Number);
                          const label = hr === 12 ? `12:${String(mn).padStart(2, "0")} PM` : hr < 12 ? `${hr}:${String(mn).padStart(2, "0")} AM` : `${hr - 12}:${String(mn).padStart(2, "0")} PM`;
                          return <option key={slot} value={slot}>{label}</option>;
                        })}
                      </select>
                      {!slotsLoading && getRescheduleTimeSlots().length === 0 && (
                        <small className="text-muted">{t("apptNoSlots")}</small>
                      )}
                    </div>
                    <div className="col-md-4 d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => submitReschedule(b._id)}
                      >
                        {t("save")}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditingId(null)}
                      >
                        {t("myApptClose")}
                      </button>
                    </div>
                  </div>
                  <small className="text-muted d-block mt-2">{t("myApptRescheduleNote")}</small>
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