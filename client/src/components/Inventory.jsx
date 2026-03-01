import React from "react";
import BloodBankNavbar from "./BloodBankNavbar";


const demoInventory = [
  {
    hospital: "Khawla Hospital",
    bloodType: "O-",
    unitsAvailable: 6,
    lastUpdated: "2025-11-30 09:15",
  },
  {
    hospital: "Khawla Hospital",
    bloodType: "O+",
    unitsAvailable: 18,
    lastUpdated: "2025-11-30 09:10",
  },
  {
    hospital: "Royal Hospital",
    bloodType: "A+",
    unitsAvailable: 25,
    lastUpdated: "2025-11-29 16:40",
  },
  {
    hospital: "Royal Hospital",
    bloodType: "B-",
    unitsAvailable: 4,
    lastUpdated: "2025-11-29 17:05",
  },
  {
    hospital: "Sultan Qaboos University Hospital",
    bloodType: "AB+",
    unitsAvailable: 10,
    lastUpdated: "2025-11-28 11:20",
  },
];

const Inventory = () => {
  return (
    <div>
      <BloodBankNavbar />

      <div className="container py-4">
      <div className="mb-3">
        <h3 className="fw-semibold mb-1" style={{ color: "#d10000" }}>
          Blood Inventory
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
              {demoInventory.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.hospital}</td>
                  <td>
                    <span className="fw-semibold">{row.bloodType}</span>
                  </td>
                  <td>{row.unitsAvailable}</td>
                  <td className="text-muted small">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Inventory;
