import React from "react";
import { Link } from "react-router-dom";
import { FaTint } from "react-icons/fa";

const urgentData = [
  { id: 1, name: "Mohammed Salim", type: "B+", date: "2025-12-12", location: "City Hospital" },
  { id: 2, name: "xx", type: "O+", date: "2025-xx-xx", location: "xxx" },
  { id: 3, name: "xx", type: "O+", date: "2025-xx-xx", location: "xxx" },
  { id: 4, name: "xx", type: "O-", date: "2025-xx-xx", location: "xxx" },
  { id: 5, name: "xx", type: "AB+", date: "2025-xx-xx", location: "xxx" },
  { id: 6, name: "xx", type: "A-", date: "2025-xx-xx", location: "xxx" },
];

const UrgentRequests = () => {
  return (
    <div className="urgent-page">

      <main className="urgent-main">
        <div className="container py-5">
          <h3 className="fw-semibold mb-3">Urgent Requests</h3>
          <p className="text-muted mb-4">
            Emergency blood requests shared by hospitals. Please contact the
            mentioned hospital if you are able to donate the listed blood type.
          </p>

          <div className="row g-4">
            {urgentData.map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="urgent-card text-center">
                  
                  <div className="urgent-drop-icon mb-2">
                    <FaTint />
                  </div>

                  <h6 className="mb-2 fw-semibold">Emergency blood needed</h6>

                  <div className="urgent-field-row">
                    <span className="urgent-field-label">Name:</span>
                    <span className="urgent-field-value">{item.name}</span>
                  </div>

                  <div className="urgent-field-row">
                    <span className="urgent-field-label">Type:</span>
                    <span className="urgent-field-value">{item.type}</span>
                  </div>

                  <div className="urgent-field-row">
                    <span className="urgent-field-label">Date:</span>
                    <span className="urgent-field-value">{item.date}</span>
                  </div>

                  <div className="urgent-field-row mb-3">
                    <span className="urgent-field-label">Location:</span>
                    <span className="urgent-field-value">{item.location}</span>
                  </div>

                  <button className="btn btn-danger btn-sm px-4">
                    Details
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </div>
  );
};

export default UrgentRequests;
