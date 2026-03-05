import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTint } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const UrgentRequests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({ bloodType: "", quantity: 1, message: "" });
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [contactModalHospital, setContactModalHospital] = useState(null);
  const prefillApplied = useRef(false);

  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
  const isHospital = user?.isHospital === true;
  const isDonor = !!user && !user.isAdmin && !user.isHospital && !user.isInventory;

  const fetchRequests = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/urgent-requests`).then((res) => (res.ok ? res.json() : [])).then((d) => setRequests(Array.isArray(d) ? d : [])),
      isHospital && user?._id
        ? fetch(`${API_BASE}/urgent-requests/hospital/${user._id}`).then((res) => (res.ok ? res.json() : [])).then((d) => setMyRequests(Array.isArray(d) ? d : []))
        : Promise.resolve(),
    ])
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [isHospital, user?._id]);

  useEffect(() => {
    const prefill = location.state?.nlpPrefill;
    if (prefill && isHospital && !prefillApplied.current) {
      prefillApplied.current = true;
      setPostForm({
        bloodType: prefill.bloodType || "",
        quantity: prefill.quantity || 1,
        message: prefill.message || "",
      });
    }
  }, [location.state, isHospital]);

  const handlePostUrgent = async (e) => {
    e.preventDefault();
    if (!postForm.bloodType || !user?._id) return;
    if (!isHospital) return;
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
          message: (postForm.message || "").trim(),
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

  const handleRemoveRequest = async (requestId) => {
    if (!user?._id || !isHospital) return;
    setRemovingId(requestId);
    try {
      const res = await fetch(`${API_BASE}/urgent-requests/${requestId}?userId=${encodeURIComponent(user._id)}`, {
        method: "DELETE",
      });
      if (res.ok) fetchRequests();
      else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Failed to remove");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Muscat",
    });
  };

  return (
    <div className="urgent-page">
      <main className="urgent-main">
        <div className="container py-5">
          <h3 className="fw-semibold mb-3">Urgent Requests</h3>
          <p className="text-muted mb-4">
            {isHospital
              ? "Request urgent blood supply by blood type. Donors can book appointments directly at your hospital."
              : "Hospitals needing urgent blood supply. Click Book to schedule an appointment at the listed hospital."}
          </p>

          {isHospital && (
            <div className="card p-3 mb-4">
              <h6 className="mb-3">Request urgent blood supply</h6>
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
                  {posting ? "Posting..." : "Post request"}
                </button>
                {postSuccess && (
                  <span className="ms-2 text-success small">Posted successfully!</span>
                )}
              </form>
            </div>
          )}

          {isHospital && myRequests.length > 0 && (
            <div className="card p-3 mb-4">
              <h6 className="mb-3">Your urgent requests</h6>
              <div className="list-group list-group-flush">
                {myRequests.map((ur) => (
                  <div key={ur._id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                      <span className="fw-semibold">{ur.bloodType}</span>
                      <span className="text-muted ms-2">× {ur.quantity || 1}</span>
                      {ur.message && <span className="text-muted small d-block">{ur.message}</span>}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={removingId === ur._id}
                      onClick={() => handleRemoveRequest(ur._id)}
                    >
                      {removingId === ur._id ? "..." : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
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

                    <h6 className="mb-2 fw-semibold">Urgent blood needed: {item.bloodType}</h6>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Hospital:</span>
                      <span className="urgent-field-value">
                        {item.hospital?.hospitalName || "—"}
                        {item.hospital?.city ? `, ${item.hospital.city}` : ""}
                      </span>
                    </div>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Quantity:</span>
                      <span className="urgent-field-value">{item.quantity}</span>
                    </div>

                    <div className="urgent-field-row">
                      <span className="urgent-field-label">Posted:</span>
                      <span className="urgent-field-value">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    {item.message && (
                      <div className="urgent-field-row">
                        <span className="urgent-field-label">Note:</span>
                        <span className="urgent-field-value">{item.message}</span>
                      </div>
                    )}

                    <div className="urgent-field-row mb-3">
                      <span className="urgent-field-label">Contact:</span>
                      <span className="urgent-field-value">
                        {item.hospital?.contactPerson || "—"}
                      </span>
                    </div>

                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      {isDonor && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-4"
                          onClick={() =>
                            navigate("/appointments", {
                              state: {
                                urgentHospitalId: item.hospital?._id,
                                urgentBloodType: item.bloodType,
                              },
                            })
                          }
                        >
                          Book
                        </button>
                      )}
                      {!user && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm px-4"
                          onClick={() =>
                            navigate("/login", {
                              state: {
                                from: "/appointments",
                                urgentHospitalId: item.hospital?._id,
                                urgentBloodType: item.bloodType,
                              },
                            })
                          }
                        >
                          Book
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm px-4"
                        onClick={() => setContactModalHospital(item.hospital)}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {contactModalHospital && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
          onClick={() => setContactModalHospital(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {contactModalHospital.hospitalName || "Hospital Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setContactModalHospital(null)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <strong>Hospital:</strong> {contactModalHospital.hospitalName || "—"}
                </div>
                {contactModalHospital.city && (
                  <div className="mb-2">
                    <strong>City:</strong> {contactModalHospital.city}
                  </div>
                )}
                <div className="mb-2">
                  <strong>Contact Person:</strong> {contactModalHospital.contactPerson || "—"}
                </div>
                {contactModalHospital.contactPhone && (
                  <div className="mb-2">
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${contactModalHospital.contactPhone}`}>
                      {contactModalHospital.contactPhone}
                    </a>
                  </div>
                )}
                {contactModalHospital.contactEmail && (
                  <div className="mb-2">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${contactModalHospital.contactEmail}`}>
                      {contactModalHospital.contactEmail}
                    </a>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {contactModalHospital.contactPhone && (
                  <a
                    href={`tel:${contactModalHospital.contactPhone}`}
                    className="btn btn-danger"
                  >
                    Call
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setContactModalHospital(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrgentRequests;
