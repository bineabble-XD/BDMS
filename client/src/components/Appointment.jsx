import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import donorIllustration from "../assets/11+.png";
import { createBooking, resetBooking } from "../features/bookingSlice";
import {
  getTodayInOman,
  getMaxDateInOman,
  getCurrentMinutesInOman,
} from "../utils/omanTime";
import { useLanguage } from "../context/LanguageContext";
import DonationEligibilityCheck from "./DonationEligibilityCheck";
import AuthLanguageToggle from "./AuthLanguageToggle";
import {
  createEmptyEligibilityAnswers,
  getEligibilityStatus,
} from "../config/donationEligibilityQuestions";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5050";

const MONTH_KEYS = [
  "monthJan",
  "monthFeb",
  "monthMar",
  "monthApr",
  "monthMay",
  "monthJun",
  "monthJul",
  "monthAug",
  "monthSep",
  "monthOct",
  "monthNov",
  "monthDec",
];

const MONTH_VALUES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Appointment = () => {
  const { t, language } = useLanguage();

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

  const { loading, success, error } = useSelector(
    (state) => state.booking
  );

  const [hospitals, setHospitals] = useState([]);

  const today = getTodayInOman();
  const maxDate = getMaxDateInOman(14);
  const maxDateObj = new Date(maxDate + "T23:59:59+04:00");

  const TIME_SLOTS = [];

  for (let h = 9; h <= 22; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 22 && m > 0) break;

      TIME_SLOTS.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(
          2,
          "0"
        )}`
      );
    }
  }

  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [eligibilityAnswers, setEligibilityAnswers] =
    useState(createEmptyEligibilityAnswers);

  const [openSection, setOpenSection] =
    useState("general");

  const [form, setForm] = useState({
    hospital: "",
    appointmentDate: "",
    appointmentTime: "",

    lastDonationMonth: "",
    donatedBefore: false,

    medsRecently: "",
    hasColdFluFever: "",
    medicalRestriction: "",

    highBloodPressure: "",
    diabetes: "",
    tattoo: "",
    travel: "",
    travelCountry: "",
    recentDonation: "",
    vaccination: "",

    confirmHealth: false,
  });

  const {
    allAnswered: eligibilityAllAnswered,
    ineligible: eligibilityIneligible,
  } = getEligibilityStatus(
    eligibilityAnswers,
    form
  );

  const eligibilityBlocksBooking =
    !eligibilityAllAnswered ||
    eligibilityIneligible;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleEligibilityChange = (id, value) => {
    setEligibilityAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    if (!form.hospital || !form.appointmentDate) {
      setBookedSlots([]);
      return;
    }

    setSlotsLoading(true);

    fetch(
      `${API_BASE}/api/bookings/slots?hospitalId=${encodeURIComponent(
        form.hospital
      )}&date=${form.appointmentDate}`
    )
      .then((res) =>
        res.ok ? res.json() : { bookedSlots: [] }
      )
      .then((data) =>
        setBookedSlots(data.bookedSlots || [])
      )
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [form.hospital, form.appointmentDate]);

  const getAvailableTimeSlots = () => {
    let slots = TIME_SLOTS.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    if (form.appointmentDate === today) {
      const currentMinutes =
        getCurrentMinutesInOman();

      slots = slots.filter((slot) => {
        const [h, m] = slot
          .split(":")
          .map(Number);

        return h * 60 + m > currentMinutes;
      });
    }

    return slots;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert(t("apptLoginFirst"));
      return;
    }

    if (!eligibilityAllAnswered) {
      alert(t("apptEligibilityAnswerAll"));
      return;
    }

    if (eligibilityIneligible) {
      alert(t("apptEligibilityNotEligible"));
      return;
    }

    if (!form.confirmHealth) {
      alert(t("apptConfirmHealthAlert"));
      return;
    }

    if (!form.hospital) {
      alert(t("apptSelectHospitalAlert"));
      return;
    }

    if (
      !form.appointmentDate ||
      !form.appointmentTime
    ) {
      alert(t("apptSelectDateTime"));
      return;
    }

    const [h, m] =
      form.appointmentTime.split(":").map(Number);

    if (
      h < 9 ||
      h > 22 ||
      (h === 22 && m > 0)
    ) {
      alert(t("apptTimeRange"));
      return;
    }

    if (m % 15 !== 0) {
      alert(t("apptTime15Min"));
      return;
    }

    const appointmentDate = new Date(
      `${form.appointmentDate}T${form.appointmentTime}+04:00`
    );

    if (appointmentDate <= new Date()) {
      alert(t("apptFutureOnly"));
      return;
    }

    if (appointmentDate > maxDateObj) {
      alert(t("apptMax2Weeks"));
      return;
    }

    dispatch(
      createBooking({
        donorId: user._id,
        hospitalId: form.hospital,
        appointmentDate,
        bloodType: user.bloodType,

        eligibility: {
          screening: {
            ...eligibilityAnswers,
          },

          lastDonationMonth:
            form.lastDonationMonth,

          donatedBefore:
            form.donatedBefore,

          medsRecently:
            form.medsRecently,

          hasColdFluFever:
            form.hasColdFluFever,

          medicalRestriction:
            form.medicalRestriction,

          highBloodPressure:
            form.highBloodPressure,

          diabetes:
            form.diabetes,

          tattoo:
            form.tattoo,

          travel:
            form.travel,

          travelCountry:
            form.travelCountry,

          recentDonation:
            form.recentDonation,

          vaccination:
            form.vaccination,
        },
      })
    );
  };

  useEffect(() => {
    if (!form.appointmentTime) return;

    if (
      bookedSlots.includes(
        form.appointmentTime
      )
    ) {
      setForm((prev) => ({
        ...prev,
        appointmentTime: "",
      }));

      return;
    }

    if (
      form.appointmentDate === today
    ) {
      const currentMinutes =
        getCurrentMinutesInOman();

      const [h, m] =
        form.appointmentTime
          .split(":")
          .map(Number);

      if (h * 60 + m <= currentMinutes) {
        setForm((prev) => ({
          ...prev,
          appointmentTime: "",
        }));
      }
    }
  }, [
    form.appointmentDate,
    form.appointmentTime,
    bookedSlots,
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/hospitals/approved`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);

          if (
            urgentHospitalId &&
            data.some(
              (h) =>
                h._id === urgentHospitalId
            )
          ) {
            setForm((prev) => ({
              ...prev,
              hospital: urgentHospitalId,
            }));
          } else if (
            data.length > 0 &&
            !form.hospital
          ) {
            setForm((prev) => ({
              ...prev,
              hospital: data[0]._id,
            }));
          }
        }
      })
      .catch(() => setHospitals([]));
  }, [urgentHospitalId]);

  useEffect(() => {
    if (success) {
      alert(t("apptSuccess"));

      dispatch(resetBooking());

      navigate("/home");
    }
  }, [
    success,
    dispatch,
    navigate,
    t,
  ]);

  if (!user) {
    return (
      <div
        className="appointment-page container-fluid py-5"
        dir={
          language === "AR"
            ? "rtl"
            : "ltr"
        }
      >
        <div className="d-flex justify-content-end mb-3">
          <AuthLanguageToggle />
        </div>

        <p className="text-muted text-center">
          {t("apptRedirectLogin")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="appointment-page container-fluid"
      style={{
        paddingBottom: "80px",
      }}
      dir={
        language === "AR"
          ? "rtl"
          : "ltr"
      }
    >
      <div className="row min-vh-100 align-items-center">

        {/* LEFT SIDE */}
        <div className="col-md-7 auth-left">

          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4 mt-3">
            <h3 className="mb-0 fw-semibold text-danger">
              {t("apptTitle")}
            </h3>

            <AuthLanguageToggle />
          </div>

          {urgentHospitalId && (
            <div className="alert alert-info mb-3 py-2">
              {t("apptUrgentBanner")}
            </div>
          )}

          <div className="appointment-form-card">

            <form
              onSubmit={handleSubmit}
              noValidate
            >

              {/* APPOINTMENT DETAILS */}
              <h5 className="mb-3">
                {t("apptDetails")}
              </h5>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  {t("apptPreferredHospital")}
                </label>

                <select
                  className="form-select"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                  required
                  disabled={
                    !!urgentHospitalId
                  }
                >
                  <option value="">
                    {t("apptSelectHospital")}
                  </option>

                  {hospitals.map((h) => (
                    <option
                      key={h._id}
                      value={h._id}
                    >
                      {h.hospitalName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row mb-4">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    {t("apptDate")}
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="appointmentDate"
                    value={
                      form.appointmentDate
                    }
                    onChange={handleChange}
                    min={today}
                    max={maxDate}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    {t("apptTime")}
                  </label>

                  <select
                    className="form-select"
                    name="appointmentTime"
                    value={
                      form.appointmentTime
                    }
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {t("apptSelectTime")}
                    </option>

                    {!slotsLoading &&
                      getAvailableTimeSlots().map(
                        (slot) => (
                          <option
                            key={slot}
                            value={slot}
                          >
                            {slot}
                          </option>
                        )
                      )}
                  </select>
                </div>
              </div>

              {/* ELIGIBILITY */}
              <section className="eligibility-screening-section">

                <h5 className="mb-4 mt-4 fw-semibold text-danger">
                  {t("apptEligibilityTitle")}
                </h5>

                {/* MAIN SCREENING */}
                <DonationEligibilityCheck
                  answers={eligibilityAnswers}
                  onChange={handleEligibilityChange}
                  t={t}
                />



                <div className="mt-4">

                  {/* GENERAL HEALTH */}
                  <div className="accordion-item border-0 shadow-sm rounded-4 mb-3 overflow-hidden">

                    <h2 className="accordion-header">

                      <button
                        type="button"
                        className="accordion-button fw-bold text-danger"
                        onClick={() =>
                          setOpenSection(
                            openSection === "general"
                              ? ""
                              : "general"
                          )
                        }
                      >
                        {t("apptGeneralHealthQuestions")}
                      </button>

                    </h2>

                    <div
                      className={`accordion-collapse collapse ${openSection === "general"
                        ? "show"
                        : ""
                        }`}
                    >

                      <div className="accordion-body">

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            {t("apptHighBloodPressure")}
                          </label>

                          <select
                            className="form-select"
                            name="highBloodPressure"
                            value={form.highBloodPressure}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            {t("apptDiabetes")}
                          </label>

                          <select
                            className="form-select"
                            name="diabetes"
                            value={form.diabetes}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="form-label fw-semibold">
                            {t("apptMedicationRecently")}
                          </label>

                          <select
                            className="form-select"
                            name="medsRecently"
                            value={form.medsRecently}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* TRAVEL */}
                  <div className="accordion-item border-0 shadow-sm rounded-4 mb-3 overflow-hidden">

                    <h2 className="accordion-header">

                      <button
                        type="button"
                        className="accordion-button fw-bold text-danger"
                        onClick={() =>
                          setOpenSection(
                            openSection === "travel"
                              ? ""
                              : "travel"
                          )
                        }
                      >
                        {t("apptLifestyleTravel")}
                      </button>

                    </h2>

                    <div
                      className={`accordion-collapse collapse ${openSection === "travel"
                        ? "show"
                        : ""
                        }`}
                    >

                      <div className="accordion-body">

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            {t("apptTattoo")}
                          </label>

                          <select
                            className="form-select"
                            name="tattoo"
                            value={form.tattoo}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            {t("apptTravelOutside")}
                          </label>

                          <select
                            className="form-select"
                            name="travel"
                            value={form.travel}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* DONATION HISTORY */}
                  <div className="accordion-item border-0 shadow-sm rounded-4 mb-3 overflow-hidden">

                    <h2 className="accordion-header">

                      <button
                        type="button"
                        className="accordion-button fw-bold text-danger"
                        onClick={() =>
                          setOpenSection(
                            openSection === "history"
                              ? ""
                              : "history"
                          )
                        }
                      >
                        {t("apptDonationHistory")}
                      </button>

                    </h2>

                    <div
                      className={`accordion-collapse collapse ${openSection === "history"
                        ? "show"
                        : ""
                        }`}
                    >

                      <div className="accordion-body">

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            {t("apptVaccination")}
                          </label>

                          <select
                            className="form-select"
                            name="vaccination"
                            value={form.vaccination}
                            onChange={handleChange}
                          >
                            <option value="">
                              {t("apptSelect")}
                            </option>

                            <option value="yes">
                              {t("apptYes")}
                            </option>

                            <option value="no">
                              {t("apptNo")}
                            </option>
                          </select>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* CONSENT */}
                  <div className="accordion-item border-0 shadow-sm rounded-4 overflow-hidden">

                    <h2 className="accordion-header">

                      <button
                        type="button"
                        className="accordion-button fw-bold text-danger"
                        onClick={() =>
                          setOpenSection(
                            openSection === "consent"
                              ? ""
                              : "consent"
                          )
                        }
                      >
                        {t("apptDonorConsent")}
                      </button>

                    </h2>

                    <div
                      className={`accordion-collapse collapse ${openSection === "consent"
                        ? "show"
                        : ""
                        }`}
                    >

                      <div className="accordion-body">

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="confirmHealth"
                            name="confirmHealth"
                            checked={form.confirmHealth}
                            onChange={handleChange}
                            required
                          />

                          <label
                            className="form-check-label"
                            htmlFor="confirmHealth"
                          >
                            {t("apptConfirmHealth")}
                          </label>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

                {/* STATUS */}
                <div
                  className={`mt-4 p-4 rounded-4 text-white fw-semibold ${eligibilityIneligible
                    ? "bg-danger"
                    : "bg-success"
                    }`}
                >
                  {eligibilityIneligible ? (
                    <>
                      ❌{t("apptNotEligible")}
                    </>
                  ) : (
                    <>
                      <>✅ {t("apptEligible")}</>
                    </>
                  )}
                </div>

              </section>

              {error && (
                <p className="text-danger">
                  {error}
                </p>
              )}

              <div className="d-flex gap-3 mt-4">

                <button
                  type="submit"
                  className="btn btn-danger flex-grow-1"
                  disabled={
                    loading ||
                    eligibilityBlocksBooking ||
                    !form.confirmHealth
                  }
                >
                  {loading
                    ? t("apptSubmitting")
                    : t("apptBook")}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() =>
                    navigate("/home")
                  }
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-5 text-center d-none d-md-block">
          <img
            src={donorIllustration}
            alt="Donation Illustration"
            className="img-fluid"
            style={{
              maxWidth: "70%",
            }}
          />
        </div>
      </div>
    </div >
  );
};

export default Appointment;