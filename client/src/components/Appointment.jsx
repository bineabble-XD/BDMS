import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import bdmslogo from "../assets/bdmslogo.png";
import donorIllustration from "../assets/11+.png";
import { createBooking, resetBooking } from "../features/bookingSlice";

const Appointment = () => {
  const hospitalMap = {
    "Khawla Hospital": "1424252525h",
    "Royal Hospital": "2636363h",
    "Sultan Qaboos University Hospital": "kksk8",
    "Armed Forces Hospital": "sksks9",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.booking);

  const [form, setForm] = useState({
    hospital: "Khawla Hospital",
    appointmentMonth: "",
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

    // TEMP hospital mapping (replace later with DB IDs)
    const hospitalMap = {
      "Khawla Hospital": "HOSPITAL_ID_1",
      "Royal Hospital": "HOSPITAL_ID_2",
      "Sultan Qaboos University Hospital": "HOSPITAL_ID_3",
      "Armed Forces Hospital": "HOSPITAL_ID_4",
    };

    // Convert month + time to Date
    const appointmentDate = new Date(
      `${form.appointmentMonth} 1, 2026 ${form.appointmentTime}`
    );

    dispatch(
      createBooking({
        donorId: user._id,
        hospitalId: hospitalMap[form.hospital],
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
                >
                  <option>Khawla Hospital</option>
                  <option>Royal Hospital</option>
                  <option>Sultan Qaboos University Hospital</option>
                  <option>Armed Forces Hospital</option>
                </select>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Appointment Month
                  </label>
                  <select
                    className="form-select"
                    name="appointmentMonth"
                    value={form.appointmentMonth}
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

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
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