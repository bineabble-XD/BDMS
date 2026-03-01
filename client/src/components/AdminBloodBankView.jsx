import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";

const API_BASE = "http://localhost:5050";

const AdminBloodBankView = () => {
  const [bloodRecords, setBloodRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/blood-bank/all`)
      .then((res) => res.json())
      .then((data) => {
        setBloodRecords(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
        setBloodRecords([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="container py-4">
        <h2>View All Blood Bank Records</h2>
        {loading && <p className="text-muted">Loading...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {!loading && !error && (
          <ul className="list-group">
            {bloodRecords.length === 0 ? (
              <li className="list-group-item text-muted">No records found.</li>
            ) : (
              bloodRecords.map((record) => (
                <li key={record._id} className="list-group-item">
                  {record.bloodType} - {record.availability} units available -{" "}
                  {record.expiryDate
                    ? new Date(record.expiryDate).toLocaleDateString()
                    : "N/A"}{" "}
                  - {record.hospitalId?.hospitalName || record.hospitalId || "N/A"}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminBloodBankView;
