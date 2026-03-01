import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import donorIllustration from "../assets/11+.png";
import { createBooking, resetBooking } from "../features/bookingSlice";

const API_BASE = "http://localhost:5050";

const Appointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.booking);

  const [hospitals, setHospitals] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const minTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

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

    const appointmentDate = new Date(`${form.appointmentDate}T${form.appointmentTime}`);

    if (appointmentDate <= new Date()) {
      alert("Please select a future date and time. You cannot book appointments in the past.");
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
    fetch(`${API_BASE}/hospitals/approved`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);
          if (data.length > 0) {
            setForm((prev) => (prev.hospital ? prev : { ...prev, hospital: data[0]._id }));
          }
        }
      })
      .catch(() => setHospitals([]));
  }, []);

  useEffect(() => {
    if (success) {
      alert("Appointment request submitted!");
      dispatch(resetBooking());
      navigate("/home");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="appointment-page container-fluid" style={{ paddingBottom: "80px" }}>
      <div className="row min-vh-100 align-items-center">
        <div className="col-md-7 auth-left">
          <h3 className="fw-semibold mb-4 mt-3" style={{ color: "#d10000" }}>
            Book an Appointment
          </h3>

          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <form onSubmit={handleSubmit}>
              <h5 className="mb-3">Appointment Details</h5>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Preferred Hospital
                </label>
                <select
                  className="form-select"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select hospital</option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hospitalName} {h.city ? `(${h.city})` : ""}
                    </option>
                  ))}
                </select>
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
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    min={form.appointmentDate === today ? minTime : undefined}
                    required
                  />
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