import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMinDateInOman, getTodayInOman, getCurrentMinutesInOman, getNowDatetimeLocalOman } from "../utils/omanTime";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBankManagement = () => {
  const { hospitalId } = useParams();
  const [bloodRecords, setBloodRecords] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecord, setNewRecord] = useState({
    bloodType: "",
    availability: "",
    donationDate: "",
    expiryDate: "",
  });

  const fetchRecords = () => {
    if (!hospitalId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/blood-bank/${hospitalId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => {
        const records = data.records ?? (Array.isArray(data) ? data : []);
        setBloodRecords(records);
        setProfileId(data.profileId ?? hospitalId);
      })
      .catch((err) => {
        setError(err.message || "Failed to load blood bank records");
        setBloodRecords([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, [hospitalId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const addBloodRecord = async (e) => {
    e.preventDefault();
    const targetProfileId = profileId || hospitalId;
    if (!targetProfileId || !newRecord.bloodType || !newRecord.availability || !newRecord.expiryDate) return;

    if (newRecord.donationDate) {
      const donationDt = new Date(newRecord.donationDate);
      const now = new Date();
      if (donationDt > now) {
        setError("Donation date and time cannot be in the future. You cannot add a record for a time that has not been reached yet.");
        return;
      }
      const minDate = new Date(getMinDateInOman(-14) + "T00:00:00+04:00");
      if (donationDt < minDate) {
        setError("Donation date must be within the last 2 weeks.");
        return;
      }
      const [h, m] = newRecord.donationDate.split("T")[1]?.split(":").map(Number) || [0, 0];
      if (h < 9 || h > 22 || (h === 22 && m > 0)) {
        setError("Donation time must be between 9:00 AM and 10:00 PM.");
        return;
      }
      if (m % 15 !== 0) {
        setError("Time must be in 15-minute intervals.");
        return;
      }
      const today = getTodayInOman();
      const donationDateStr = newRecord.donationDate.split("T")[0];
      if (donationDateStr === today) {
        const currentMinutes = getCurrentMinutesInOman();
        const slotMinutes = h * 60 + m;
        if (slotMinutes > currentMinutes) {
          setError("Donation time cannot be in the future. You cannot add a record for a time that has not been reached yet.");
          return;
        }
      }
    }

    setError(null);
    try {
      const res = await fetch(`${API_BASE}/blood-bank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodType: newRecord.bloodType,
          availability: newRecord.availability,
          donationDate: newRecord.donationDate || null,
          expiryDate: newRecord.expiryDate,
          hospitalId: targetProfileId,
        }),
      });
      if (res.ok) {
        setNewRecord({ bloodType: "", availability: "", donationDate: "", expiryDate: "" });
        fetchRecords();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Failed to add record");
      }
    } catch (err) {
      setError("Failed to add blood record");
    }
  };

  const deleteBloodRecord = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/blood-bank/${id}`, { method: "DELETE" });
      if (res.ok) fetchRecords();
    } catch (err) {
      setError("Failed to delete record");
    }
  };

  if (!hospitalId) {
    return (
      <div className="bdms-page">
        <div className="container py-4">
          <p className="text-danger">No hospital selected. Please log in as a hospital.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bdms-page">
      <div className="container py-5">
        <h2 className="bdms-page-title mb-3">Manage Blood Bank Records</h2>
        {error && <div className="alert alert-warning">{error}</div>}
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h6 className="card-subtitle mb-3">Add new record</h6>
                <form onSubmit={addBloodRecord} className="row g-2 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label small mb-1">Blood Type</label>
                    <select
                      name="bloodType"
                      className="form-select form-select-sm"
                      value={newRecord.bloodType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select blood type</option>
                      {BLOOD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small mb-1">Availability</label>
                    <input
                      type="number"
                      name="availability"
                      className="form-control form-control-sm"
                      value={newRecord.availability}
                      onChange={handleInputChange}
                      placeholder="Units"
                      min={0}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small mb-1">Donation Date & Time</label>
                    <input
                      type="datetime-local"
                      name="donationDate"
                      className="form-control form-control-sm"
                      value={newRecord.donationDate}
                      onChange={handleInputChange}
                      min={`${getMinDateInOman(-14)}T09:00`}
                      max={getNowDatetimeLocalOman()}
                      step={900}
                      title="Within last 2 weeks, 9 AM–10 PM, 15-min intervals. Cannot be in the future."
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label small mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      className="form-control form-control-sm"
                      value={newRecord.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-danger btn-sm w-100">
                      Add Record
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h6 className="card-subtitle mb-3">Current records</h6>
                <ul className="list-group list-group-flush">
                  {bloodRecords.map((record) => (
                    <li key={record._id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <strong>{record.bloodType}</strong> — {record.availability} units — Donation:{" "}
                        {(record.donationDate || record.createdAt)
                          ? new Date(record.donationDate || record.createdAt).toLocaleDateString("en-GB", { timeZone: "Asia/Muscat" })
                          : "—"}
                        {" "}— Expiry: {record.expiryDate ? new Date(record.expiryDate).toLocaleDateString("en-GB", { timeZone: "Asia/Muscat" }) : "—"}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteBloodRecord(record._id)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                {bloodRecords.length === 0 && <p className="text-muted mb-0 small">No records yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BloodBankManagement;
