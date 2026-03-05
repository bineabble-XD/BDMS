import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/9+.png";

const API_BASE = "http://localhost:5050";

const AdminDash = () => {
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const fetchHospitalRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch(`${API_BASE}/hospitals/pending`);
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setHospitalRequests(data);
    } catch (err) {
      console.error("Error fetching hospital requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleDecision = async (id, action) => {
    try {
      const url =
        action === "approve"
          ? `${API_BASE}/hospitals/${id}/approve`
          : `${API_BASE}/hospitals/${id}/reject`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Action failed.");
        return;
      }

      alert(data.message || "Updated.");
      fetchHospitalRequests();
    } catch (err) {
      console.error("Decision error:", err);
      alert("Server error.");
    }
  };

  useEffect(() => {
    fetchHospitalRequests();
  }, []);

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-3">

          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="dashboard-card p-4 mb-4">
                <h5 className="mb-3">Last Donations</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">City Hospital</span>
                  <span>Nov 11, 2025 , 10:00 AM</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-semibold">City Hospital</span>
                  <span>Nov 11, 2025 , 9:40 AM</span>
                </div>
                <div className="d-flex justify-content-between pb-3 mb-3 border-bottom">
                  <span className="fw-semibold">Star Hospital</span>
                  <span>Nov 10, 2025 , 8:00 PM</span>
                </div>

                <h6 className="mb-3">Urgent Requests</h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>City Hospital</span>
                  </div>
                  <Link
                    to="/urgent-requests"
                    className="btn btn-link p-0 dashboard-view-link"
                  >
                    View &gt;
                  </Link>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="urgent-dot" />
                    <span>Star Hospital</span>
                  </div>
                  <Link
                    to="/urgent-requests"
                    className="btn btn-link p-0 dashboard-view-link"
                  >
                    View &gt;
                  </Link>
                  <Link to="/admin-blood-bank" className="btn btn-danger">
                    View All Blood Bank Records
                  </Link>
                </div>
              </div>

              <div className="dashboard-card p-4">
                <h5 className="mb-3">Hospital Account Requests</h5>

                {loadingRequests && <p>Loading requests...</p>}

                {!loadingRequests && hospitalRequests.length === 0 && (
                  <p className="text-muted mb-0">
                    No pending hospital registrations.
                  </p>
                )}

                {!loadingRequests &&
                  hospitalRequests.length > 0 &&
                  hospitalRequests.map((h) => (
                    <div
                      key={h._id}
                      className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
                    >
                      <div>
                        <div className="fw-semibold">{h.hospitalName}</div>
                        <div className="small text-muted">
                          {h.city} • {h.type || "Hospital"}
                        </div>
                        <div className="small text-muted">
                          Contact: {h.contactPerson} ({h.contactPhone})
                        </div>
                        <div className="small text-muted">
                          Login Email: {h.userId?.email}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleDecision(h._id, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDecision(h._id, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dashboard-side-top mb-2">

                <img
                  src={heroImg}
                  alt="Dashboard illustration"
                  className="img-fluid dashboard-illustration"
                />
              </div>

              <div className="dashboard-side-card p-3">
                <h6 className="mb-3 text-center">Appointments</h6>

                <div className="d-flex justify-content-between mb-2">
                  <span>Abbas Allawati</span>
                  <span>Nov 22, 2025, 10AM</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Hassan Alhasni</span>
                  <span>Nov 22, 2025, 11AM</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Khalid Alroshdi</span>
                  <span>Nov 22, 2025, 12PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;
