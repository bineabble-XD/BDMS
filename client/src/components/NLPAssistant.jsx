import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/8+.png";

const API_BASE = "http://localhost:5050";

const NLPAssistant = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [quantity, setQuantity] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeLocally = () => {
    const text = input.toLowerCase();

    const bloodTypes = ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"];
    const detectedBT = bloodTypes.find((bt) => text.includes(bt));
    setBloodType(detectedBT ? detectedBT.toUpperCase() : "");

    const matchHospital = text.match(/([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+hospital/i);
    setLocation(matchHospital ? matchHospital[0].replace(/\b\w/g, (c) => c.toUpperCase()) : "");

    const highUrgency = ["urgent", "immediately", "emergency", "critical", "life-threatening", "life threatening", "within hours", "tonight", "asap"];
    const mediumUrgency = ["soon", "needed soon", "preferably"];
    if (highUrgency.some((w) => text.includes(w))) {
      setUrgency("High");
    } else if (mediumUrgency.some((w) => text.includes(w))) {
      setUrgency("Medium");
    } else {
      setUrgency("Low");
    }

    const qtyMatch = text.match(/(\d+)\s*(?:units?|bags?|pints?|donations?)/i) || text.match(/(?:need|require|want)\s+(\d+)/i) || text.match(/\b(\d+)\s*(?:of|for)/i);
    setQuantity(qtyMatch ? qtyMatch[1] : "");
  };

  const analyzeText = async () => {
    if (!input.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`${API_BASE}/api/nlp/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (res.ok) {
        const data = await res.json();
        setBloodType(data.bloodType || "");
        setLocation(data.location || "");
        setUrgency(data.urgency || "");
        setQuantity(data.quantity ? String(data.quantity) : "");
      } else {
        analyzeLocally();
      }
    } catch {
      analyzeLocally();
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
  };

  const handleCreateUrgentRequest = () => {
    const validBloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType);
    if (!validBloodType) return;
    const message = [location, urgency ? `Urgency: ${urgency}` : ""].filter(Boolean).join(". ");
    navigate("/urgent-requests", {
      state: {
        nlpPrefill: {
          bloodType,
          quantity: quantity ? parseInt(quantity, 10) : 1,
          message: message.trim() || input.trim().slice(0, 100),
        },
      },
    });
  };

  const canCreateRequest = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType);

  return (
    <div className="nlp-page">
      <div className="container py-5">
        <div className="row align-items-start g-5">
        
        <div className="col-lg-6">
          <p className="text-muted mb-1">Advanced Module • NLP</p>
          <h2 className="fw-bold mb-3">Natural Language Assistant</h2>
          <p className="mb-4">
            Paste any urgent request or donor message and let BDMS automatically 
            detect <strong>blood type</strong>, <strong>location</strong>, and 
            <strong> urgency level</strong>.
          </p>

          <div className="p-3 rounded shadow-sm border">
            <h6 className="fw-semibold mb-2">1. Enter Free-Text Request</h6>

            <textarea
              className="form-control mb-3"
              rows="5"
              placeholder="Example: Urgent O- blood needed at Nizwa Hospital tonight."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button className="btn btn-danger w-100 mb-2" onClick={analyzeText} disabled={analyzing || !input.trim()}>
              {analyzing ? "Analyzing..." : "Analyze Text"}
            </button>
            <button className="btn btn-outline-secondary w-100" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <img
            src={heroImg}
            alt="Illustration"
            className="img-fluid mb-4"
            style={{ borderRadius: "16px" }}
          />

          <div className="p-3 rounded shadow-sm border mb-4">
            <h6 className="fw-semibold mb-3">2. Extracted Details</h6>

            <div className="d-flex justify-content-between pb-2">
              <span>Detected Blood Type</span>
              <strong>{bloodType}</strong>
            </div>

            <div className="d-flex justify-content-between pb-2">
              <span>Detected Quantity</span>
              <strong>{quantity || "Not found"}</strong>
            </div>

            <div className="d-flex justify-content-between pb-2">
              <span>Location</span>
              <strong>{location || "Not found"}</strong>
            </div>

            <div className="d-flex justify-content-between">
              <span>Urgency Level</span>
              <span className={`badge bg-${urgency === "High" ? "danger" : urgency === "Medium" ? "warning" : "secondary"}`}>
                {urgency}
              </span>
            </div>
          </div>

          <div className="p-3 rounded shadow-sm border">
            <h6 className="fw-semibold mb-3">Preview of Structured Request</h6>

            <p className="m-0"><strong>Blood Type:</strong> {bloodType || "—"}</p>
            <p className="m-0"><strong>Quantity:</strong> {quantity || "1"}</p>
            <p className="m-0"><strong>Location:</strong> {location || "—"}</p>
            <p className="m-0"><strong>Urgency:</strong> {urgency || "—"}</p>

            {canCreateRequest && (
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handleCreateUrgentRequest}
              >
                Create Urgent Request
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NLPAssistant;
