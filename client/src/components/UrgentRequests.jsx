import React, { useEffect, useState } from "react";
import { FaTint } from "react-icons/fa";

const API_BASE = "http://localhost:5050";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const UrgentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({ bloodType: "", quantity: 1, message: "" });
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
  const isHospital = user?.isHospital === true;

  const fetchRequests = () => {
    fetch(`${API_BASE}/urgent-requests`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlePostUrgent = async (e) => {
    e.preventDefault();
    if (!postForm.bloodType || !user?._id) return;
    setPosting(true);
    setPostSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/urgent-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          bloodType: postForm.bloodType,
          quantity: Number(postForm.quantity) || 1,
          message: postForm.message || "",
        }),
      });
      if (res.ok) {
        setPostForm({ bloodType: "", quantity: 1, message: "" });
        setPostSuccess(true);
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="urgent-page">
      <main className="urgent-main">
        <div className="container py-5">
          <h3 className="fw-semibold mb-3">Urgent Requests</h3>
          <p className="text-muted mb-4">
            Emergency blood requests shared by hospitals. Please contact the
            mentioned hospital if you are able to donate the listed blood type.
          </p>

          {isHospital && (
            <div className="card p-3 mb-4">
              <h6 className="mb-3">Post an urgent request</h6>
              <form onSubmit={handlePostUrgent}>
                <div className="row g-2 mb-2">
                  <div className="col-md-4">
                    <select
                      className="form-select form-select-sm"
                      value={postForm.bloodType}
                      onChange={(e) =>
                        setPostForm({ ...postForm, bloodType: e.target.value })
                      }
                      required
                    >
                      <option value="">Blood type</option>
                      {BLOOD_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Quantity"
                      min={1}
                      value={postForm.quantity}
                      onChange={(e) =>
                        setPostForm({ ...postForm, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Message (optional)"
                      value={postForm.message}
                      onChange={(e) =>
                        setPostForm({ ...postForm, message: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-danger btn-sm"
                  disabled={posting || !postForm.bloodType}
                >
                  {posting ? "Posting..." : "Post urgent request"}
                </button>
                {postSuccess && (
                  <span className="ms-2 text-success small">Posted successfully!</span>
                )}
              </form>
            </div>
          )}

          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted">No urgent requests at this time.</p>
          ) : (
            <div className="row g-4">
              {requests.map((item) => (
                <div key={item._id} className="col-md-4">
                  <div className="urgent-card text-center">
                    <div className="urgent-drop-icon mb-2">
                      <FaTint />
                    </div>

                    <h6 className="mb-2 fw-semibold">Emergency blood needed</h6>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Contact:</span>
                      <span className="urgent-field-value">
                        {item.hospital?.contactPerson || "—"}
                      </span>
                    </div>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Type:</span>
                      <span className="urgent-field-value">{item.bloodType}</span>
                    </div>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Date:</span>
                      <span className="urgent-field-value">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="urgent-field-row mb-3">
                      <span className="urgent-field-label">Location:</span>
                      <span className="urgent-field-value">
                        {item.hospital?.hospitalName || "—"}
                        {item.hospital?.city ? `, ${item.hospital.city}` : ""}
                      </span>
                    </div>

                    <a
                      href={
                        item.hospital?.contactPhone
                          ? `tel:${item.hospital.contactPhone}`
                          : "#"
                      }
                      className="btn btn-danger btn-sm px-4"
                    >
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UrgentRequests;
