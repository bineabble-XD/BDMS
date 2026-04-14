import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Muscat",
  }).replace(",", "");
};

const Inventory = () => {
  const { t } = useLanguage();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/blood-bank/all`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((records) => {
        const recordsList = Array.isArray(records) ? records : [];
        const key = (r) => {
          const hospital = r.hospitalId?.hospitalName || "Unknown Hospital";
          return `${hospital}|${r.bloodType}`;
        };
        const grouped = {};
        recordsList.forEach((r) => {
          const k = key(r);
          if (!grouped[k]) {
            grouped[k] = {
              hospital: r.hospitalId?.hospitalName || "Unknown Hospital",
              bloodType: r.bloodType,
              unitsAvailable: 0,
              lastUpdated: r.donationDate || r.updatedAt || r.createdAt,
            };
          }
          grouped[k].unitsAvailable += Number(r.availability) || 0;
          const recDate = r.donationDate || r.updatedAt || r.createdAt;
          if (recDate && (!grouped[k].lastUpdated || new Date(recDate) > new Date(grouped[k].lastUpdated))) {
            grouped[k].lastUpdated = recDate;
          }
        });
        setInventory(Object.values(grouped).sort((a, b) => {
          const cmp = a.hospital.localeCompare(b.hospital);
          return cmp !== 0 ? cmp : a.bloodType.localeCompare(b.bloodType);
        }));
      })
      .catch((err) => {
        setError(err.message || "Failed to load inventory");
        setInventory([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="bdms-page inventory-page">
      <div className="container py-5">
        <div className="mb-3">
          <h3 className="fw-semibold mb-1 text-danger">
            {t("inventoryTitle")}
          </h3>
        </div>

        <div
          className="shadow-sm"
          style={{
            borderRadius: "14px",
            border: "1px solid #e0e0e0",
            padding: "16px",
            backgroundColor: "#ffffff",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Current Stock by Hospital</h5>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status" />
              <p className="mt-2 text-muted">Loading inventory…</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <p>{error}</p>
              <button className="btn btn-outline-danger" onClick={fetchInventory}>
                Retry
              </button>
            </div>
          ) : inventory.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>No blood stock records yet.</p>
              <p className="small mb-0">Stock will appear here once hospitals add records via Blood Bank Management.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "60px" }}>#</th>
                    <th>Hospital</th>
                    <th>Blood Type</th>
                    <th>Units Available</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((row, index) => (
                    <tr key={`${row.hospital}-${row.bloodType}`}>
                      <td>{index + 1}</td>
                      <td>{row.hospital}</td>
                      <td>
                        <span className="fw-semibold">{row.bloodType}</span>
                      </td>
                      <td>{row.unitsAvailable}</td>
                      <td className="text-muted small">{formatDate(row.lastUpdated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
