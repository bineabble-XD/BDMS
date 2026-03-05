import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import donorIllustration from "../assets/11+.png";
import { createBooking, resetBooking } from "../features/bookingSlice";
import { getTodayInOman, getMaxDateInOman, getCurrentMinutesInOman } from "../utils/omanTime";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const Appointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const urgentHospitalId = location.state?.urgentHospitalId;
  const urgentBloodType = location.state?.urgentBloodType;

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/appointments",
          urgentHospitalId,
          urgentBloodType,
        },
      });
    }
  }, [user, navigate, urgentHospitalId, urgentBloodType]);

  const { loading, success, error } = useSelector((state) => state.booking);

  const [hospitals, setHospitals] = useState([]);
  const today = getTodayInOman();
  const maxDate = getMaxDateInOman(14);
  const maxDateObj = new Date(maxDate + "T23:59:59+04:00");

  // 9 AM - 10 PM in 15-min intervals
  const TIME_SLOTS = [];
  for (let h = 9; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;
      TIME_SLOTS.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
  }

  const getAvailableTimeSlots = () => {
    let slots = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
    if (form.appointmentDate === today) {
      const currentMinutes = getCurrentMinutesInOman();
      slots = slots.filter((slot) => {
        const [h, m] = slot.split(":").map(Number);
        return h * 60 + m > currentMinutes;
      });
    }
    return slots;
  };

  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({
    hospital: "",
    appointmentDate: "",
    appointmentTime: "",
    lastDonationMonth: "",
    donatedBefore: false,
    sickPast3Months: false,
    medsRecently: "",
    hasColdFluFever: "",
    medicalRestriction: "",
    confirmHealth: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (!form.hospital || !form.appointmentDate) {
      setBookedSlots([]);
      return;
    }
    setSlotsLoading(true);
    fetch(`${API_BASE}/api/bookings/slots?hospitalId=${encodeURIComponent(form.hospital)}&date=${form.appointmentDate}`)
      .then((res) => (res.ok ? res.json() : { bookedSlots: [] }))
      .then((data) => setBookedSlots(data.bookedSlots || []))
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.hospital, form.appointmentDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!form.confirmHealth) {
      alert("Please confirm your health information");
      return;
    }

    if (!form.hospital) {
      alert("Please select a hospital");
      return;
    }

    if (!form.appointmentDate || !form.appointmentTime) {
      alert("Please select appointment date and time");
      return;
    }

    const [h, m] = form.appointmentTime.split(":").map(Number);
    if (h < 9 || h > 22 || (h === 22 && m > 0)) {
      alert("Appointment time must be between 9:00 AM and 10:00 PM");
      return;
    }
    if (m % 15 !== 0) {
      alert("Time must be in 15-minute intervals");
      return;
    }

    const appointmentDate = new Date(`${form.appointmentDate}T${form.appointmentTime}+04:00`);

    if (appointmentDate <= new Date()) {
      alert("Please select a future date and time. You cannot book appointments in the past.");
      return;
    }
    if (appointmentDate > maxDateObj) {
      alert("Appointment date cannot be more than 2 weeks from today.");
      return;
    }

    dispatch(
      createBooking({
        donorId: user._id,
        hospitalId: form.hospital,
        appointmentDate,
        bloodType: user.bloodType,

        // 🔒 ALL your health & eligibility fields are preserved
        eligibility: {
          lastDonationMonth: form.lastDonationMonth,
          donatedBefore: form.donatedBefore,
          sickPast3Months: form.sickPast3Months,
          medsRecently: form.medsRecently,
          hasColdFluFever: form.hasColdFluFever,
          medicalRestriction: form.medicalRestriction,
        },
      })
    );
  };

  useEffect(() => {
    if (!form.appointmentTime) return;
    if (bookedSlots.includes(form.appointmentTime)) {
      setForm((prev) => ({ ...prev, appointmentTime: "" }));
      return;
    }
    if (form.appointmentDate === today) {
      const currentMinutes = getCurrentMinutesInOman();
      const [h, m] = form.appointmentTime.split(":").map(Number);
      if (h * 60 + m <= currentMinutes) {
        setForm((prev) => ({ ...prev, appointmentTime: "" }));
      }
    }
  }, [form.appointmentDate, form.appointmentTime, bookedSlots]);

  useEffect(() => {
    fetch(`${API_BASE}/hospitals/approved`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);
          if (urgentHospitalId && data.some((h) => h._id === urgentHospitalId)) {
            setForm((prev) => ({ ...prev, hospital: urgentHospitalId }));
          } else if (data.length > 0 && !form.hospital) {
            setForm((prev) => ({ ...prev, hospital: data[0]._id }));
          }
        }
      })
      .catch(() => setHospitals([]));
  }, [urgentHospitalId]);

  useEffect(() => {
    if (success) {
      alert("Appointment request submitted!");
      dispatch(resetBooking());
      navigate("/home");
    }
  }, [success, dispatch, navigate]);

  if (!user) {
    return (
      <div className="appointment-page container-fluid py-5 text-center">
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="appointment-page container-fluid" style={{ paddingBottom: "80px" }}>
      <div className="row min-vh-100 align-items-center">
        <div className="col-md-7 auth-left">
          <h3 className="fw-semibold mb-4 mt-3 text-danger">
            Book an Appointment
          </h3>

          {urgentHospitalId && (
            <div className="alert alert-info mb-3 py-2">
              Booking for an urgent blood request. Select an available slot below.
            </div>
          )}

          <div className="appointment-form-card">
            <form onSubmit={handleSubmit}>
              <h5 className="mb-3">Appointment Details</h5>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  {urgentHospitalId ? "Hospital" : "Preferred Hospital"}
                </label>
                <select
                  className="form-select"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                  required
                  disabled={!!urgentHospitalId}
                >
                  <option value="">Select hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hospitalName} {h.city ? `(${h.city})` : ""}
                    </option>
                  ))}
                </select>
                {urgentHospitalId && (
                  <small className="text-muted d-block mt-1">Hospital fixed for this urgent request.</small>
                )}
                {hospitals.length === 0 && (
                  <small className="text-muted">No approved hospitals available. Please try again later.</small>
                )}
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    min={today}
                    max={maxDate}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Time</label>
                  <select
                    className="form-select"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    required
                    disabled={!form.hospital || !form.appointmentDate || slotsLoading}
                  >
                    <option value="">
                      {!form.hospital || !form.appointmentDate
                        ? "Select hospital and date first"
                        : slotsLoading
                          ? "Loading slots..."
                          : "Select time"}
                    </option>
                    {!slotsLoading && getAvailableTimeSlots().map((slot) => {
                      const [h, m] = slot.split(":").map(Number);
                      const label = h === 12 ? `12:${String(m).padStart(2, "0")} PM` : h < 12 ? `${h}:${String(m).padStart(2, "0")} AM` : `${h - 12}:${String(m).padStart(2, "0")} PM`;
                      return <option key={slot} value={slot}>{label}</option>;
                    })}
                  </select>
                  {!slotsLoading && form.hospital && form.appointmentDate && getAvailableTimeSlots().length === 0 && (
                    <small className="text-muted">No slots available. Try another date.</small>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Last Donation Month
                </label>
                <select
                  className="form-select"
                  name="lastDonationMonth"
                  value={form.lastDonationMonth}
                  onChange={handleChange}
                >
                  <option value="">Select month</option>
                  {[
                    "January","February","March","April","May","June",
                    "July","August","September","October","November","December",
                  ].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* 🔽 ALL YOUR CHECKBOXES & RADIOS BELOW ARE UNTOUCHED */}

              <h5 className="mb-3 mt-4">Eligibility Screening</h5>

              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="donatedBefore"
                  checked={form.donatedBefore}
                  onChange={handleChange}
                />
                <label className="form-check-label ms-1">
                  I have donated blood before
                </label>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="sickPast3Months"
                  checked={form.sickPast3Months}
                  onChange={handleChange}
                />
                <label className="form-check-label ms-1">
                  I was sick in the past 3 months
                </label>
              </div>

              <div className="form-check mb-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="confirmHealth"
                  checked={form.confirmHealth}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label ms-1">
                  I confirm that the above health information is accurate.
                </label>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-danger flex-grow-1" disabled={loading}>
                  {loading ? "Submitting..." : "Book Appointment"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => navigate("/home")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt="Donor illustration"
            className="img-fluid"
            style={{ maxWidth: "70%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointment;