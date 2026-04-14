import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMinDateInOman, getTodayInOman } from "../utils/omanTime";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodBankManagement = () => {
  const { t } = useLanguage();
  const { hospitalId } = useParams();
  const [bloodRecords, setBloodRecords] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getExpiryDateFromDonation = (donationDate) => {
    const donation = new Date(donationDate);
    donation.setDate(donation.getDate() + 35);
    return donation.toISOString().split("T")[0];
  };

  const getDefaultRecord = () => {
    const donationDate = getTodayInOman();

    return {
      bloodType: "",
      availability: "",
      donationDate,
      expiryDate: getExpiryDateFromDonation(donationDate),
      donorName: "",
    };
  };

  const [newRecord, setNewRecord] = useState(getDefaultRecord);

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

  useEffect(() => {
    if (!newRecord.donationDate) return;

    setNewRecord((prev) => ({
      ...prev,
      expiryDate: getExpiryDateFromDonation(prev.donationDate),
    }));
  }, [newRecord.donationDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const addBloodRecord = async (e) => {
    e.preventDefault();
    const targetProfileId = profileId || hospitalId;

    if (!targetProfileId || !newRecord.bloodType || !newRecord.availability || !newRecord.expiryDate) return;

    if (newRecord.donationDate) {
      const donationDate = newRecord.donationDate;
      const today = getTodayInOman();
      const minDate = getMinDateInOman(-14);

      if (donationDate > today) {
        setError("Donation date cannot be in the future.");
        return;
      }

      if (donationDate < minDate) {
        setError("Donation date must be within the last 2 weeks.");
        return;
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
          donorName: newRecord.donorName?.trim() || undefined,
        }),
      });

      if (res.ok) {
        setNewRecord(getDefaultRecord());
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
        <h2 className="bdms-page-title mb-3">{t("bloodBankManageTitle")}</h2>
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
                    <label className="form-label small mb-1">Donation Date</label>
                    <input
                      type="date"
                      name="donationDate"
                      className="form-control form-control-sm"
                      value={newRecord.donationDate}
                      onChange={handleInputChange}
                      min={getMinDateInOman(-14)}
                      max={getTodayInOman()}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label small mb-1">Donor name (optional)</label>
                    <input
                      type="text"
                      name="donorName"
                      className="form-control form-control-sm"
                      value={newRecord.donorName}
                      onChange={handleInputChange}
                      placeholder="Full name"
                      maxLength={120}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label small mb-1">Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      className="form-control form-control-sm"
                      value={newRecord.expiryDate}
                      readOnly
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
                        <strong>{record.bloodType}</strong> — {record.availability} units
                        {record.donorName ? ` — Donor: ${record.donorName}` : ""} — Donation:{" "}
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