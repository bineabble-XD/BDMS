import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/8+.png";
import { extractNlpLocal } from "../utils/nlpLocalFallback";
import { useLanguage } from "../context/LanguageContext";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const NLPAssistant = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [sentiment, setSentiment] = useState(null);

  const [analytics, setAnalytics] = useState({
    bloodTypeData: [],
    locationData: [],
    totalRequests: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/nlp/analytics`);
      const data = await res.json();

      if (res.ok) {
        setAnalytics(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyResult = (data) => {
    setBloodType(data.bloodType || "");

    setLocation(
      (data.location || "")
        .replace(/required at/i, "")
        .replace(/needed at/i, "")
        .replace(/at/i, "")
        .trim()
    );

    setUrgency(data.urgency || "");
    setQuantity(data.quantity != null ? String(data.quantity) : "");
    setMessage(data.message || "");
    setSentiment(data.sentiment || null);
  };

  const analyzeText = async () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/nlp/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        applyResult(data);
      } else {
        setError(data.message || t("nlpErrAnalyze"));
        applyResult(extractNlpLocal(trimmed));
      }
    } catch {
      setError(t("nlpErrOffline"));
      applyResult(extractNlpLocal(trimmed));
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setBloodType("");
    setLocation("");
    setUrgency("");
    setQuantity("");
    setMessage("");
    setError("");
    setSentiment(null);
  };

  const handleCreateUrgentRequest = () => {
    const validBloodType = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ].includes(bloodType);

    if (!validBloodType) return;

    const parts = [
      location,
      urgency ? `Urgency: ${urgency}` : "",
      message ? message.slice(0, 200) : "",
    ].filter(Boolean);

    const composed = parts.join(". ") || input.trim().slice(0, 200);

    navigate("/urgent", {
      state: {
        nlpPrefill: {
          bloodType,
          quantity: quantity ? parseInt(quantity, 10) || 1 : 1,
          message: composed,
          location,
          urgency,
          sentiment,
        },
      },
    });
  };

  const canCreateRequest = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ].includes(bloodType);

  return (
    <div
      className="nlp-page"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="container py-5">
        <div className="row align-items-start g-5">
          {/* LEFT SIDE */}
          <div className="col-lg-6">
            <p className="text-muted mb-1">
              AI Powered NLP Detection
            </p>

            <h2 className="fw-bold mb-3">
              NLP Request Analyzer
            </h2>

            <p className="mb-4">
              Paste an urgent request or note. BDMS detects
              blood type, quantity, location, and urgency.
            </p>

            <div className="p-4 rounded shadow-sm border bg-white analytics-card">
              <h6 className="fw-semibold mb-3">
                1. Enter free text
              </h6>

              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="Example: Urgent AB- needed at Nizwa Hospital tonight."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              {error && (
                <p className="small text-warning mb-2">
                  {error}
                </p>
              )}

              <button
                type="button"
                className="btn btn-danger w-100 mb-2"
                onClick={analyzeText}
                disabled={analyzing || !input.trim()}
              >
                {analyzing
                  ? "Analyzing..."
                  : "Analyze text"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={clearAll}
              >
                Clear
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-6">
            <img
              src={heroImg}
              alt="NLP"
              className="img-fluid mb-4"
              style={{ borderRadius: "16px" }}
            />

            {/* Extracted Details */}
            <div className="p-4 rounded shadow-sm border bg-white mb-4 analytics-card">
              <h6 className="fw-semibold mb-3">
                2. Extracted details
              </h6>

              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span>Blood type</span>
                <strong>
                  {bloodType || "Not detected"}
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Quantity</span>
                <strong>
                  {quantity !== "" ? quantity : "1"}
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Location</span>

                <strong className="text-end ms-2">
                  {location || "Not detected"}
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>Urgency</span>

                <span
                  className={`badge bg-${
                    urgency === "High"
                      ? "danger"
                      : urgency === "Medium"
                      ? "warning"
                      : "secondary"
                  }`}
                >
                  {urgency || "Not detected"}
                </span>
              </div>
            </div>

            {canCreateRequest && (
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={handleCreateUrgentRequest}
              >
                Create urgent request
              </button>
            )}
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="row mt-5 g-4">
          <h4 className="fw-bold mb-3 text-danger">
            NLP Analytics Overview
          </h4>

          {/* Blood Type */}
          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-3 h-100 bg-white analytics-card">
              <h6 className="fw-semibold text-center mb-3">
                Requests by Blood Type
              </h6>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.bloodTypeData.filter(
                      (item) => item.value > 0
                    )}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    label={({ value }) =>
                      value > 0 ? value : ""
                    }
                  >
                    {analytics.bloodTypeData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            [
                              "#e63946",
                              "#457b9d",
                              "#2a9d8f",
                              "#f4a261",
                              "#9b5de5",
                              "#4cc9f0",
                              "#ff006e",
                              "#6c757d",
                            ][index % 8]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <small className="text-muted text-center d-block">
                {analytics.totalRequests} Requests
              </small>
            </div>
          </div>

          {/* Hospital */}
          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-3 h-100 bg-white analytics-card">
              <h6 className="fw-semibold text-center mb-3">
                Requests by Hospital
              </h6>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={analytics.locationData.filter(
                    (item) => item.value > 0
                  )}
                >
                  <XAxis hide dataKey="name" />
                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `${value} Requests`,
                      "Total",
                    ]}
                    labelFormatter={(label) =>
                      `Hospital: ${label}`
                    }
                  />

                  <Bar
                    dataKey="value"
                    fill="#dc3545"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Requested */}
          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-4 h-100 bg-white analytics-card">
              <h6 className="fw-semibold mb-4 text-center">
                Most Requested Blood Type
              </h6>

              {[...analytics.bloodTypeData]
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>{item.name}</small>
                      <small>{item.value}</small>
                    </div>

                    <div
                      className="progress"
                      style={{ height: "10px" }}
                    >
                      <div
                        className={`progress-bar ${
                          index === 0
                            ? "bg-danger"
                            : index === 1
                            ? "bg-primary"
                            : index === 2
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                        style={{
                          width: `${Math.min(
                            item.value * 15,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Smart Analytics */}
          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-4 h-100 bg-white analytics-card">
              <h6 className="fw-semibold mb-4 text-center">
                Smart Analytics
              </h6>

              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-danger me-3"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Total Requests
                  </small>

                  <h5 className="mb-0">
                    {analytics.totalRequests}
                  </h5>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-primary me-3"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Most Requested Blood Type
                  </small>

                  <h6 className="mb-0">
                    {[...analytics.bloodTypeData]?.sort(
                      (a, b) => b.value - a.value
                    )[0]?.name || "-"}
                  </h6>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-success me-3"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Active Hospitals
                  </small>

                  <h6 className="mb-0">
                    {analytics.locationData.length}
                  </h6>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-warning me-3"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Top Requesting Hospital
                  </small>

                  <h6 className="mb-0">
                    {[...analytics.locationData]?.sort(
                      (a, b) => b.value - a.value
                    )[0]?.name || "-"}
                  </h6>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-dark me-3"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />

                <div>
                  <small className="text-muted">
                    Rarest Requested Type
                  </small>

                  <h6 className="mb-0">
                    {[...analytics.bloodTypeData]
                      ?.filter((item) => item.value > 0)
                      ?.sort((a, b) => a.value - b.value)[0]
                      ?.name || "-"}
                  </h6>
                </div>
              </div>

              <small className="text-muted d-block mt-4">
                Last updated:{" "}
                {new Date().toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPAssistant;