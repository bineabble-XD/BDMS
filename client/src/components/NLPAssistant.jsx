import React, { useState } from "react";
import heroImg from "../assets/8+.png";
import AdminNavbar from "./AdminNavbar";
import HospitalNavbar from "./HospitalNavbar";
import BloodBankNavbar from "./BloodBankNavbar";

const NLPAssistant = () => {
  const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
  const Navbar = user?.isAdmin ? AdminNavbar : user?.isHospital ? HospitalNavbar : BloodBankNavbar;
  const [input, setInput] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");


  const analyzeText = () => {
    const text = input.toLowerCase();

    const bloodTypes = ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"];
    const detectedBT = bloodTypes.find((bt) => text.includes(bt));
    setBloodType(detectedBT ? detectedBT.toUpperCase() : "Not Found");

    const matchHospital = text.match(/([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+hospital/);
    setLocation(matchHospital ? matchHospital[0].replace(/\b\w/g, c => c.toUpperCase()) : "Not Found");

    if (text.includes("urgent") || text.includes("immediately") || text.includes("emergency")) {
      setUrgency("High");
    } else if (text.includes("soon") || text.includes("asap")) {
      setUrgency("Medium");
    } else {
      setUrgency("Low");
    }
  };

  const clearAll = () => {
    setInput("");
    setBloodType("");
    setLocation("");
    setUrgency("");
  };

  return (
    <div className="nlp-page">
      <Navbar />

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

            <button className="btn btn-danger w-100 mb-2" onClick={analyzeText}>
              Analyze Text
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
              <span>Entered Location</span>
              <strong>{location}</strong>
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

            <p className="m-0"><strong>Blood Type:</strong> {bloodType}</p>
            <p className="m-0"><strong>Location:</strong> {location}</p>
            <p className="m-0"><strong>Urgency:</strong> {urgency}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NLPAssistant;
